import {
  BridgeConfig,
  Bridges,
  ErrorHandlers,
  IEventTypes,
  IRequestTypes,
  createBridge,
} from "@/bridge";

// 요청 타입 정의
interface UserProfileRequestTypes extends IRequestTypes {
  getUserProfile: {
    default: {
      params: { userId: string };
      result: { id: string; name: string };
    };
    "1.0.0": {
      params: { userId: string };
      result: { id: string; name: string };
    };
    "2.0.0": {
      params: { userId: string; includeEmail: boolean };
      result: { id: string; name: string; email?: string };
    };
  };
  updateUserProfile: {
    default: {
      params: { userId: string; name: string };
      result: { success: boolean };
    };
    "1.0.0": {
      params: { userId: string; name: string };
      result: { success: boolean };
    };
    "2.0.0": {
      params: { userId: string; name: string; email?: string };
      result: { success: boolean; updatedAt: string };
    };
  };
}

// 이벤트 타입 정의
interface UserEventTypes extends IEventTypes {
  onUserStatusChange: {
    default: { userId: string; status: "online" | "offline" };
    "1.0.0": { userId: string; status: "online" | "offline" };
    "2.0.0": {
      userId: string;
      status: "online" | "offline" | "away";
      lastSeen?: number;
    };
  };
}

// Bridge 설정
const bridges: Bridges = {
  Android: {
    postMessage: (message: string) => {
      console.log("Android postMessage:", message);
      // 실제로는 여기서 Android 네이티브 코드를 호출합니다.
    },
  },
  iOS: {
    postMessage: (message: string) => {
      console.log("iOS postMessage:", message);
      // 실제로는 여기서 iOS 네이티브 코드를 호출합니다.
    },
  },
  ReactNative: {
    postMessage: (message: string) => {
      console.log("React Native postMessage:", message);
      // 실제로는 여기서 React Native 브릿지를 통해 네이티브 코드를 호출합니다.
    },
  },
};

const errorHandlers: ErrorHandlers = {
  default: (error: Error) => {
    console.error("Bridge error:", error);
    return error;
  },
};

const config: BridgeConfig = {
  version: "2.0.0",
  bridges,
  defaultTimeout: 5000,
};

// Bridge 인스턴스 생성
const bridge = createBridge<UserProfileRequestTypes, UserEventTypes>(
  errorHandlers,
  config
);

// Bridge 사용 예시
async function getUserProfile(userId: string) {
  try {
    const [result, error] = await bridge.request("getUserProfile", [
      { version: "2.0.0", params: { userId, includeEmail: true } },
      { version: "1.0.0", params: { userId } },
      { version: "default", params: { userId } },
    ]);

    if (error) {
      console.error("Error fetching user profile:", error);
      return;
    }

    if (result) {
      console.log("User profile:", result);
      // 결과 처리
      if (result.version === "2.0.0" && "email" in result.result) {
        console.log("User email:", result.result.email);
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

async function updateUserProfile(userId: string, name: string, email?: string) {
  try {
    const [result, error] = await bridge.request("updateUserProfile", [
      { version: "2.0.0", params: { userId, name, email } },
      { version: "1.0.0", params: { userId, name } },
      { version: "default", params: { userId, name } },
    ]);

    if (error) {
      console.error("Error updating user profile:", error);
      return;
    }

    if (result) {
      console.log("Update result:", result);
      if (result.version === "2.0.0") {
        console.log("Updated at:", result.result.updatedAt);
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }
}

// 이벤트 리스너 설정
bridge.on("onUserStatusChange", (response) => {
  console.log("User status changed:", response);
  if (response.version === "2.0.0" && response.data.status === "away") {
    console.log("User last seen:", response.data.lastSeen);
  }
});

// 사용 예시
getUserProfile("user123");
updateUserProfile("user123", "John Doe", "john@example.com");

// 네이티브 앱에서 이벤트를 트리거하는 시뮬레이션
setTimeout(() => {
  window.dispatchEvent(
    new MessageEvent("message", {
      data: JSON.stringify({
        type: "event",
        method: "onUserStatusChange",
        version: "2.0.0",
        payload: { userId: "user123", status: "away", lastSeen: Date.now() },
      }),
    })
  );
}, 2000);
