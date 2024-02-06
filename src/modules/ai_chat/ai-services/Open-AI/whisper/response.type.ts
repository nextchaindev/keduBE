import { ApiPropertyOptional } from '@nestjs/swagger';
import Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

import { JOI_DEFAULT_VALIDATION_OPTIONS } from '@/commons/validations';

export const languageCode = [
  {
    code: 'af',
    name: 'Afrikaans',
    korean_name: '아프리칸스어',
  },
  {
    code: 'ar',
    name: 'Arabic',
    korean_name: '아랍어',
  },
  {
    code: 'hy',
    name: 'Armenian',
    korean_name: '아르메니아어',
  },
  {
    code: 'az',
    name: 'Azerbaijani',
    korean_name: '아제르바이잔어',
  },
  {
    code: 'be',
    name: 'Belarusian',
    korean_name: '벨라루스어',
  },
  {
    code: 'bs',
    name: 'Bosnian',
    korean_name: '보스니아어',
  },
  {
    code: 'bg',
    name: 'Bulgarian',
    korean_name: '불가리아어',
  },
  {
    code: 'ca',
    name: 'Catalan',
    korean_name: '카탈로니아어',
  },
  {
    code: 'zh',
    name: 'Chinese',
    korean_name: '중국어',
  },
  {
    code: 'hr',
    name: 'Croatian',
    korean_name: '크로아티아어',
  },
  {
    code: 'cs',
    name: 'Czech',
    korean_name: '체코어',
  },
  {
    code: 'da',
    name: 'Danish',
    korean_name: '덴마크어',
  },
  {
    code: 'nl',
    name: 'Dutch',
    korean_name: '네덜란드어',
  },
  {
    code: 'en',
    name: 'English',
    korean_name: '영어',
  },
  {
    code: 'et',
    name: 'Estonian',
    korean_name: '에스토니아어',
  },
  {
    code: 'fi',
    name: 'Finnish',
    korean_name: '핀란드어',
  },
  {
    code: 'fr',
    name: 'French',
    korean_name: '프랑스어',
  },
  {
    code: 'gl',
    name: 'Galician',
    korean_name: '갈리시아어',
  },
  {
    code: 'de',
    name: 'German',
    korean_name: '독일어',
  },
  {
    code: 'el',
    name: 'Greek',
    korean_name: '그리스어',
  },
  {
    code: 'he',
    name: 'Hebrew',
    korean_name: '히브리어',
  },
  {
    code: 'hi',
    name: 'Hindi',
    korean_name: '힌디어',
  },
  {
    code: 'hu',
    name: 'Hungarian',
    korean_name: '헝가리어',
  },
  {
    code: 'is',
    name: 'Icelandic',
    korean_name: '아이슬란드어',
  },
  {
    code: 'id',
    name: 'Indonesian',
    korean_name: '인도네시아어',
  },
  {
    code: 'it',
    name: 'Italian',
    korean_name: '이탈리아어',
  },
  {
    code: 'ja',
    name: 'Japanese',
    korean_name: '일본어',
  },
  {
    code: 'kn',
    name: 'Kannada',
    korean_name: '칸나다어',
  },
  {
    code: 'kk',
    name: 'Kazakh',
    korean_name: '카자흐어',
  },
  {
    code: 'ko',
    name: 'Korean',
    korean_name: '한국어',
  },
  {
    code: 'lv',
    name: 'Latvian',
    korean_name: '라트비아어',
  },
  {
    code: 'lt',
    name: 'Lithuanian',
    korean_name: '리투아니아어',
  },
  {
    code: 'mk',
    name: 'Macedonian',
    korean_name: '마케도니아어',
  },
  {
    code: 'ms',
    name: 'Malay',
    korean_name: '말레이어',
  },
  {
    code: 'mr',
    name: 'Marathi',
    korean_name: '마라티어',
  },
  {
    code: 'mi',
    name: 'Maori',
    korean_name: '마오리어',
  },
  {
    code: 'ne',
    name: 'Nepali',
    korean_name: '네팔어',
  },
  {
    code: 'no',
    name: 'Norwegian',
    korean_name: '노르웨이어',
  },
  {
    code: 'fa',
    name: 'Persian',
    korean_name: '페르시아어',
  },
  {
    code: 'pl',
    name: 'Polish',
    korean_name: '폴란드어',
  },
  {
    code: 'pt',
    name: 'Portuguese',
    korean_name: '포르투갈어',
  },
  {
    code: 'ro',
    name: 'Romanian',
    korean_name: '루마니아어',
  },
  {
    code: 'ru',
    name: 'Russian',
    korean_name: '러시아어',
  },
  {
    code: 'sr',
    name: 'Serbian',
    korean_name: '세르비아어',
  },
  {
    code: 'sk',
    name: 'Slovak',
    korean_name: '슬로바키아어',
  },
  {
    code: 'sl',
    name: 'Slovenian',
    korean_name: '슬로베니아어',
  },
  {
    code: 'es',
    name: 'Spanish',
    korean_name: '스페인어',
  },
  {
    code: 'sw',
    name: 'Swahili',
    korean_name: '스와힐리어',
  },
  {
    code: 'sv',
    name: 'Swedish',
    korean_name: '스웨덴어',
  },
  {
    code: 'tl',
    name: 'Tagalog',
    korean_name: '타갈로그어',
  },
  {
    code: 'ta',
    name: 'Tamil',
    korean_name: '타밀어',
  },
  {
    code: 'th',
    name: 'Thai',
    korean_name: '태국어',
  },
  {
    code: 'tr',
    name: 'Turkish',
    korean_name: '터키어',
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    korean_name: '우크라이나어',
  },
  {
    code: 'ur',
    name: 'Urdu',
    korean_name: '우르두어',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    korean_name: '베트남어',
  },
  {
    code: 'cy',
    name: 'Welsh',
    korean_name: '웨일스어',
  },
];

@JoiSchemaOptions(JOI_DEFAULT_VALIDATION_OPTIONS)
export class CreateMessageWhisperDto {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().guid().required())
  room_id: string;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(
    Joi.string()
      .required()
      .valid(...languageCode.map((item) => item.code)),
  )
  language_code: string;

  @ApiPropertyOptional({
    type: String,
    format: 'binary',
    required: true,
  })
  attachFile: Express.Multer.File;

  @ApiPropertyOptional({ type: String, required: false })
  @JoiSchema(Joi.string().optional())
  attach_url?: string;
}
