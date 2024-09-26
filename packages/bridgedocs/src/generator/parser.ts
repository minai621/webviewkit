import * as ts from "typescript";
import {
  InterfaceInfo,
  MethodInfo,
  ParamInfo,
  ParsedDocs,
  PropInfo,
  VersionInfo,
} from "../types";

export function parseTypeScriptFiles(
  files: string[],
  tsConfigPath: string
): ParsedDocs {
  const program = ts.createProgram(files, {
    configFilePath: tsConfigPath,
  });
  const checker = program.getTypeChecker();
  const docs: ParsedDocs = {};

  for (const sourceFile of program.getSourceFiles()) {
    if (!files.includes(sourceFile.fileName)) continue;
    ts.forEachChild(sourceFile, (node) => visitNode(node, checker, docs));
  }

  return docs;
}

function visitNode(node: ts.Node, checker: ts.TypeChecker, docs: ParsedDocs) {
  if (ts.isInterfaceDeclaration(node) && isTargetInterface(node, checker)) {
    const interfaceName = node.name.text;
    const interfaceInfo: InterfaceInfo = {
      description: getJSDocDescription(node),
      since: getJSDocTag(node, "since"),
      members: {},
    };

    node.members.forEach((member) => {
      if (ts.isPropertySignature(member) && member.name) {
        const memberName = member.name.getText();
        const methodInfo: MethodInfo = {
          description: getJSDocDescription(member),
          example: getJSDocTag(member, "example"),
          versions: {},
        };

        if (member.type && ts.isTypeLiteralNode(member.type)) {
          member.type.members.forEach((versionMember) => {
            if (ts.isPropertySignature(versionMember) && versionMember.name) {
              const versionName = versionMember.name
                .getText()
                .replace(/['"]/g, "");
              const versionInfo: VersionInfo = {
                description: getJSDocDescription(versionMember),
                since: getJSDocTag(versionMember, "since"),
                deprecated: getJSDocTag(versionMember, "deprecated"),
                params: {},
                result: {},
              };

              if (
                versionMember.type &&
                ts.isTypeLiteralNode(versionMember.type)
              ) {
                versionMember.type.members.forEach((versionTypeMember) => {
                  if (
                    ts.isPropertySignature(versionTypeMember) &&
                    versionTypeMember.name
                  ) {
                    const typeMemberName = versionTypeMember.name.getText();
                    if (
                      typeMemberName === "params" ||
                      typeMemberName === "result"
                    ) {
                      versionInfo[typeMemberName] = getDetailedTypeInfo(
                        versionTypeMember.type,
                        checker
                      );
                    }
                  }
                });
              }

              methodInfo.versions[versionName] = versionInfo;
            }
          });
        }

        interfaceInfo.members[memberName] = methodInfo;
      }
    });

    docs[interfaceName] = interfaceInfo;
  }
}

function isTargetInterface(
  node: ts.InterfaceDeclaration,
  checker: ts.TypeChecker
): boolean {
  if (node.heritageClauses) {
    for (const clause of node.heritageClauses) {
      for (const type of clause.types) {
        const symbol = checker.getSymbolAtLocation(type.expression);
        if (symbol) {
          const name = checker.getFullyQualifiedName(symbol);
          if (name === "IEventTypes" || name === "IRequestTypes") {
            return true;
          }
        }
      }
    }
  }
  return false;
}

function getDetailedTypeInfo(
  typeNode: ts.TypeNode | undefined,
  checker: ts.TypeChecker
): { [key: string]: ParamInfo | PropInfo } {
  if (!typeNode || !ts.isTypeLiteralNode(typeNode)) return {};

  const result: { [key: string]: ParamInfo | PropInfo } = {};
  typeNode.members.forEach((member) => {
    if (ts.isPropertySignature(member) && member.name) {
      const propertyName = member.name.getText();
      const propertyType = checker.typeToString(
        checker.getTypeFromTypeNode(member.type!)
      );
      const description = getJSDocComment(member);
      const optional = member.questionToken !== undefined;
      result[propertyName] = { type: propertyType, description, optional };
    }
  });

  return result;
}

function getJSDocComment(node: ts.Node): string {
  const jsDocComments = ts.getJSDocCommentsAndTags(node) as ts.JSDoc[];
  if (jsDocComments && jsDocComments.length > 0) {
    const comment = jsDocComments[0].comment;
    if (typeof comment === "string") {
      return comment.trim();
    } else if (Array.isArray(comment)) {
      return comment
        .map((c) => c.text)
        .join(" ")
        .trim();
    }
  }
  return "";
}

function getJSDocDescription(node: ts.Node): string {
  const jsDocTags = ts.getJSDocTags(node);

  function getCommentText(comment: unknown): string {
    if (typeof comment === "string") {
      return comment;
    } else if (Array.isArray(comment)) {
      return comment.map((c) => getCommentText(c)).join(" ");
    } else if (comment && typeof comment === "object" && "text" in comment) {
      return comment.text as string;
    }
    return "";
  }

  const mainDescription = jsDocTags
    .filter((tag) => !tag.tagName)
    .map((tag) => getCommentText(tag.comment))
    .join("\n")
    .trim();

  const paramDescription = jsDocTags
    .filter(
      (tag): tag is ts.JSDocParameterTag =>
        !!tag.tagName &&
        ts.isJSDocParameterTag(tag) &&
        tag.tagName.escapedText === "param"
    )
    .map((tag) => {
      const paramName = tag.name?.getText() || "unknown";
      const comment = getCommentText(tag.comment);
      return `${paramName}: ${comment}`;
    })
    .join("\n")
    .trim();

  return mainDescription + (paramDescription ? "\n\n" + paramDescription : "");
}

function getJSDocTag(node: ts.Node, tagName: string): string | undefined {
  const jsDocTags = ts.getJSDocTags(node);
  const tag = jsDocTags.find(
    (tag) => tag.tagName && tag.tagName.escapedText === tagName
  );
  return tag && tag.comment ? tag.comment.toString() : undefined;
}
