import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import path from "path";

// Definición de tipos TypeScript para el servicio
interface Emotion {
  label: string;
  intensity: number;
}

interface EmotionResponse {
  dominant: string;
  emotions: Emotion[];
}

interface EmotionRequest {
  text: string;
}

interface EmotionAnalyzerClient extends grpc.Client {
  AnalyzeEmotion(
    request: EmotionRequest,
    callback: (
      error: grpc.ServiceError | null,
      response: EmotionResponse
    ) => void
  ): grpc.ClientUnaryCall;
}

// Cargar el archivo proto
const PROTO_PATH = path.join(
  import.meta.dirname,
  "../proto/emotion_analysis.proto"
);

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const emotionProto = grpc.loadPackageDefinition(packageDefinition)
  .emotion as any;

// Crear cliente
const client = new emotionProto.EmotionAnalyzer(
  "localhost:50051",
  grpc.credentials.createInsecure()
) as EmotionAnalyzerClient;

// Función para analizar emociones
function analyzeEmotion(text: string): Promise<EmotionResponse> {
  return new Promise((resolve, reject) => {
    client.AnalyzeEmotion({ text }, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

// Función principal
async function main() {
  try {
    console.log("🚀 Connecting to Python gRPC server...\n");

    // Ejemplo 1: Texto del enunciado
    const text1 =
      "I'm happy about the sale, but nervous about meeting the deadline.";
    console.log(`📝 Input: "${text1}"`);

    const result1 = await analyzeEmotion(text1);
    console.log("📊 Output:", JSON.stringify(result1, null, 2));
    console.log("");

    // Ejemplo 2: Otro texto
    const text2 = "I'm so excited and amazed by this wonderful opportunity!";
    console.log(`📝 Input: "${text2}"`);

    const result2 = await analyzeEmotion(text2);
    console.log("📊 Output:", JSON.stringify(result2, null, 2));
    console.log("");

    // Ejemplo 3: Texto negativo
    const text3 = "I'm really angry and frustrated with this situation.";
    console.log(`📝 Input: "${text3}"`);

    const result3 = await analyzeEmotion(text3);
    console.log("📊 Output:", JSON.stringify(result3, null, 2));
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    client.close();
    console.log("\n✅ Connection closed");
  }
}

// Ejecutar
main();
