import { MigrationInterface, QueryRunner } from 'typeorm';

import { AIToolModel } from '@/models/ai_tool.model';
import { AITool } from '@/models/entities/ai_tool.entity';

const GROUP_AI_BOT = [
  {
    name: 'AI API',
    children: [
      {
        key: 'DocumentQA',
        name: '행정문서 QA',
        apiKey: '5e9e66ce-9fa3-442b-a4b0-74fde35a34c8',
        apiKeyId: null,
      },
      {
        key: 'LegalQA',
        name: '법률 QA',
        apiKey: '5e9e66ce-9fa3-442b-a4b0-74fde35a34c8',
        apiKeyId: null,
      },
      {
        key: 'ObjectDetection',
        name: '객체검출',
        apiKey: '5e9e66ce-9fa3-442b-a4b0-74fde35a34c8',
        apiKeyId: null,
      },
      {
        key: 'SceneSegmentation',
        name: '장면 분할',
        apiKey: '5e9e66ce-9fa3-442b-a4b0-74fde35a34c8',
        apiKeyId: null,
      },
      {
        key: 'SentenceParapharse',
        name: '문장 패러프레이즈 인식 기술',
        apiKey: '5e9e66ce-9fa3-442b-a4b0-74fde35a34c8',
        apiKeyId: null,
      },
      {
        key: 'SpeechRecognition',
        name: '음성인식 기술​',
        apiKey: '5e9e66ce-9fa3-442b-a4b0-74fde35a34c8',
        apiKeyId: null,
      },
    ],
  },
  {
    name: 'KaKao',
    children: [
      {
        key: 'KoGPT',
        name: 'Kakao Chat Bot',
        apiKey: '0d239c519413348dd5daa3cbf5ae07a8',
        apiKeyId: null,
      },
      {
        key: 'Karlo',
        name: 'Karlo',
        apiKey: '0d239c519413348dd5daa3cbf5ae07a8',
        apiKeyId: null,
      },
    ],
  },
  {
    name: 'Create Image',
    children: [
      {
        key: 'Dall-E2',
        name: 'Dall-E2 (OpenAI)',
        apiKey: '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',
        apiKeyId: null,
      },
    ],
  },
  {
    name: 'OpenAI',
    children: [
      {
        key: 'GPTTurbo',
        name: 'GPT-3.5 터보',
        apiKey: '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',
        apiKeyId: null,
      },
      {
        key: 'Whisper',
        name: '위스퍼',
        apiKey: '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',
        apiKeyId: null,
      },
    ],
  },
  {
    name: '맡김 AI',
    children: [
      {
        key: 'KeywordExtraction',
        name: '키워드 추출',
        apiKey: 'c9f6a008-2912-408b-be1f-318581640f36',
        apiKeyId: null,
      },
      {
        key: 'ProfanityExtraction',
        name: '비속어 추출',
        apiKey: 'c9f6a008-2912-408b-be1f-318581640f36',
        apiKeyId: null,
      },
      {
        key: 'SentimentAnalysis',
        name: '감성 분석',
        apiKey: 'c9f6a008-2912-408b-be1f-318581640f36',
        apiKeyId: null,
      },
      {
        key: 'SentimentExtraction',
        name: '감성어 추출',
        apiKey: 'c9f6a008-2912-408b-be1f-318581640f36',
        apiKeyId: null,
      },
      {
        key: 'ProperNounTopicExtraction',
        name: '주제어 추출',
        apiKey: 'c9f6a008-2912-408b-be1f-318581640f36',
        apiKeyId: null,
      },
    ],
  },
  {
    name: '추가 AI',
    children: [
      {
        key: 'Vito',
        name: '비토',
        en_name: 'Vito',
        apiKey: 'cNfSwuKuI3GNELttiLroywbnlj81U2Is8JQHDpBg',
        apiKeyId: 'GsvVAzmA68D_Tr0epP9J',
      },
    ],
  },
  {
    name: '네이버 클라우드',
    en_name: 'Naver',
    children: [
      {
        key: 'Clova',
        name: 'CLOVA 보이스',
        apiKey: 'DncTEdU3tjTxAQFmFodAr3IBPjfzXi3AzdHt2syZ',
        apiKeyId: 'oiahmgxuex',
      },
      {
        key: 'PapagoImageTranslation',
        name: '파파고 이미지 번역기',
        apiKey: 'DncTEdU3tjTxAQFmFodAr3IBPjfzXi3AzdHt2syZ',
        apiKeyId: 'oiahmgxuex',
      },
      {
        key: 'PapagoTranslation',
        name: '파파고 번역기',
        apiKey: 'Mk4zdxwwJyJGf2NFalbFBLMZw3gFNNgt0rFloiWI',
        apiKeyId: '4a0hky51cn',
      },
    ],
  },
];

export class AITools1695633281_202119250848488 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const ai_tools = GROUP_AI_BOT.map((group) => {
      return {
        name: group.name,
        children: group.children.map((ai_tool) => {
          return {
            key: ai_tool.key,
            name: ai_tool.name,
            isPublished: true,
            apiKey: ai_tool?.apiKey,
            apiKeyId: ai_tool?.apiKeyId,
          };
        }),
        isPublished: true,
      };
    }) as AITool[];

    const aiToolModel = new AIToolModel(
      queryRunner.manager.getRepository(AITool),
    );

    for (const parentTool of ai_tools) {
      const savedParent = await aiToolModel.repository.save(parentTool);
      if (!parentTool.children) continue;

      const children = parentTool.children.map((child) => {
        return aiToolModel.repository.create({
          ...child,
          parent: savedParent,
        });
      });

      await aiToolModel.repository.save(children);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {
    // queryRunner.query('DELETE FROM ai_tool');
  }
}
