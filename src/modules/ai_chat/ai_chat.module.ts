import { Module } from '@nestjs/common';

import { CommonAiServicesModule } from '@/commons/ai-services/common-ai-services.module';
import { ModelsModule } from '@/models/models.module';

import { ChatService } from '../chat/chat.service';
import { AiChatController } from './ai_chat.controller';
import { AiChatService } from './ai_chat.service';
import { LegalQAService } from './ai-services/AI-API/legalQA';
import { ObjectDetectionService } from './ai-services/AI-API/objectDetection';
import { SceneSegmentationService } from './ai-services/AI-API/sceneSegmentation';
import { SentenceParaphraseService } from './ai-services/AI-API/sentenceParaphrase';
import { SpeechRecognitionService } from './ai-services/AI-API/speechRecognition';
import { DallEService } from './ai-services/CreateImage/dall-e';
import { KeywordExtractionService } from './ai-services/EntrustedAI/keywordExtraction';
import { ProfanityExtractionService } from './ai-services/EntrustedAI/profanityExtraction';
import { ProperNounTopicExtractionService } from './ai-services/EntrustedAI/properNounTopicExtraction';
import { SentimentAnalysisService } from './ai-services/EntrustedAI/sentimentAnalysis';
import { SentimentExtractionService } from './ai-services/EntrustedAI/sentimentExtraction';
import { KarloService } from './ai-services/KaKao/Karlo';
import { KoGPTService } from './ai-services/KaKao/KoGPT';
import { ClovaService } from './ai-services/Naver/Clova';
import { PapagoImageTranslationService } from './ai-services/Naver/PapagoImageTranslation';
import { PapagoTranslationService } from './ai-services/Naver/PapagoTranslation';
import { OpenAIService } from './ai-services/Open-AI/gptTurbo';
import { WhisperService } from './ai-services/Open-AI/whisper';
import { VitoService } from './ai-services/Vito';

@Module({
  imports: [ModelsModule, CommonAiServicesModule],
  controllers: [AiChatController],
  providers: [
    AiChatService,
    ChatService,
    OpenAIService,
    WhisperService,
    LegalQAService,
    SentenceParaphraseService,
    SpeechRecognitionService,
    DallEService,
    ObjectDetectionService,
    SceneSegmentationService,
    VitoService,
    KeywordExtractionService,
    SentimentAnalysisService,
    SentimentExtractionService,
    ProfanityExtractionService,
    ProperNounTopicExtractionService,
    KoGPTService,
    KarloService,
    PapagoImageTranslationService,
    ClovaService,
    PapagoTranslationService,
  ],
  exports: [AiChatService],
})
export class AiChatModule {}
