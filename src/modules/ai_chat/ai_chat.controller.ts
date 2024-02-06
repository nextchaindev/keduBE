import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { IsPublicEndpoint } from '@/commons/decorators';

import { AiChatService } from './ai_chat.service';
import { LegalQAService } from './ai-services/AI-API/legalQA/index';
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
import { IndexParamsDto } from './dto/provider.param';
import { CreateMessageAIChatDto } from './dto/send-message.dto';

@Controller('ai-chat/:providerName')
export class AiChatController {
  public serviceMaps = {
    ['GPTTurbo']: this.openAIService,
    ['Whisper']: this.whisperService,
    ['LegalQA']: this.legalQAService,
    ['SentenceParapharse']: this.sentenceParaphraseService,
    ['SpeechRecognition']: this.speechRecognitionService,
    ['Dall-E2']: this.dallEService,
    ['ObjectDetection']: this.objectDetectionService,
    ['SceneSegmentation']: this.sceneSegmentationService,
    ['Vito']: this.vitoService,
    ['KeywordExtraction']: this.keywordExtraction,
    ['SentimentAnalysis']: this.sentimentAnalysis,
    ['SentimentExtraction']: this.sentimentExtraction,
    ['ProfanityExtraction']: this.profanityExtraction,
    ['ProperNounTopicExtraction']: this.properNounTopicExtraction,
    ['KoGPT']: this.koGPTService,
    ['Karlo']: this.karloService,
    ['PapagoImageTranslation']: this.papagoImageToImageTranslationService,
    ['Clova']: this.clovaService,
    ['PapagoTranslation']: this.papagoTranslationService,
  } as any;
  constructor(
    private readonly aiChatService: AiChatService,
    private readonly openAIService: OpenAIService,
    private readonly whisperService: WhisperService,
    private readonly legalQAService: LegalQAService,
    private readonly sentenceParaphraseService: SentenceParaphraseService,
    private readonly speechRecognitionService: SpeechRecognitionService,
    private readonly dallEService: DallEService,
    private readonly objectDetectionService: ObjectDetectionService,
    private readonly sceneSegmentationService: SceneSegmentationService,
    private readonly vitoService: VitoService,
    private readonly keywordExtraction: KeywordExtractionService,
    private readonly sentimentAnalysis: SentimentAnalysisService,
    private readonly sentimentExtraction: SentimentExtractionService,
    private readonly profanityExtraction: ProfanityExtractionService,
    private readonly properNounTopicExtraction: ProperNounTopicExtractionService,
    private readonly koGPTService: KoGPTService,
    private readonly karloService: KarloService,
    private readonly papagoImageToImageTranslationService: PapagoImageTranslationService,
    private readonly clovaService: ClovaService,
    private readonly papagoTranslationService: PapagoTranslationService,
  ) {}

  @IsPublicEndpoint()
  @Post('/send-message')
  @UseInterceptors(FileInterceptor('attachFile'))
  async sendMessage(
    @Body() payload: CreateMessageAIChatDto,
    @Param() { providerName }: IndexParamsDto,
    @UploadedFile() attachFile?: Express.Multer.File,
  ) {
    const AIService = this.serviceMaps[providerName];
    return await AIService.sendMessage(payload, attachFile);
  }

  @Get('/language-code')
  async getLanguageCode(@Param() { providerName }: IndexParamsDto) {
    const AIService = this.serviceMaps[providerName];
    return await AIService.getLanguageCode();
  }

  @Get('/speaker')
  async getSpeaker(@Param() { providerName }: IndexParamsDto) {
    const AIService = this.serviceMaps[providerName];
    return await AIService.getSpeaker();
  }
}
