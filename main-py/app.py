import grpc
from concurrent import futures
import time
import re

# Imports generados por el codegen
import emotion_analysis_pb2
import emotion_analysis_pb2_grpc


class EmotionAnalyzerService(emotion_analysis_pb2_grpc.EmotionAnalyzerServicer):
    """Implementación del servicio de análisis de emociones"""
    
    def __init__(self):
        # Palabras clave para detectar emociones (ejemplo simplificado)
        self.emotion_keywords = {
            'joy': ['happy', 'excited', 'great', 'love', 'wonderful', 'glad'],
            'sadness': ['sad', 'unhappy', 'depressed', 'down', 'disappointed'],
            'fear': ['nervous', 'afraid', 'scared', 'worried', 'anxious'],
            'anger': ['angry', 'mad', 'frustrated', 'annoyed', 'furious'],
            'surprise': ['surprised', 'shocked', 'amazed', 'astonished']
        }
    
    def analyze_text(self, text):
        """Analiza el texto y retorna emociones con intensidades"""
        text_lower = text.lower()
        detected_emotions = []
        
        for emotion, keywords in self.emotion_keywords.items():
            intensity = 0.0
            matches = 0
            
            for keyword in keywords:
                if keyword in text_lower:
                    matches += 1
                    # Calcular intensidad basada en coincidencias
                    intensity += 0.3
            
            if intensity > 0:
                # Normalizar intensidad (máximo 1.0)
                intensity = min(intensity, 1.0)
                detected_emotions.append({
                    'label': emotion,
                    'intensity': intensity
                })
        
        # Si no se detectó nada, retornar neutral
        if not detected_emotions:
            detected_emotions.append({
                'label': 'neutral',
                'intensity': 0.5
            })
        
        # Ordenar por intensidad descendente
        detected_emotions.sort(key=lambda x: x['intensity'], reverse=True)
        
        return detected_emotions
    
    def AnalyzeEmotion(self, request, context):
        """Implementación del método RPC"""
        print(f"Received request: {request.text}")
        
        # Analizar emociones
        emotions = self.analyze_text(request.text)
        
        # Crear objetos Emotion para la respuesta
        emotion_objects = [
            emotion_analysis_pb2.Emotion(
                label=e['label'],
                intensity=e['intensity']
            )
            for e in emotions
        ]
        
        # Crear respuesta
        response = emotion_analysis_pb2.EmotionResponse(
            dominant=emotions[0]['label'],
            emotions=emotion_objects
        )
        
        print(f"Sending response - Dominant: {response.dominant}")
        return response


def serve():
    """Inicia el servidor gRPC"""
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    
    emotion_analysis_pb2_grpc.add_EmotionAnalyzerServicer_to_server(
        EmotionAnalyzerService(), server
    )
    
    server.add_insecure_port('[::]:50051')
    server.start()
    
    print("✅ Python gRPC server started on port 50051")
    
    try:
        while True:
            time.sleep(86400)  # Mantener el servidor corriendo
    except KeyboardInterrupt:
        print("\n🛑 Shutting down server...")
        server.stop(0)


if __name__ == '__main__':
    serve()