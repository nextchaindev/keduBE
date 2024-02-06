import { MigrationInterface, QueryRunner } from 'typeorm';

export class Kedu1707142832335 implements MigrationInterface {
  name = 'Kedu1707142832335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "kedu"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying(50) NOT NULL, "username" character varying(50) NOT NULL, "email" character varying(50) NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "kedu"."ai_tool" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "key" character varying, "name" character varying NOT NULL, "en_name" character varying, "description" character varying, "logo" character varying, "api_key" character varying, "api_key_id" character varying, "organization_key" character varying, "is_published" boolean NOT NULL DEFAULT false, "video_path" character varying, "ai_tool_id" uuid, "ai_parent_id" uuid, CONSTRAINT "REL_8192da2267127f1b2ada65354e" UNIQUE ("ai_tool_id"), CONSTRAINT "PK_7645dc37abbc646bdfcfb76d75c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "kedu"."ai_tool" ADD CONSTRAINT "FK_8192da2267127f1b2ada65354e4" FOREIGN KEY ("ai_tool_id") REFERENCES "kedu"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "kedu"."ai_tool" ADD CONSTRAINT "FK_6e03bcb2608cca15a90c5af5512" FOREIGN KEY ("ai_parent_id") REFERENCES "kedu"."ai_tool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "kedu"."ai_tool" DROP CONSTRAINT "FK_6e03bcb2608cca15a90c5af5512"`,
    );
    await queryRunner.query(
      `ALTER TABLE "kedu"."ai_tool" DROP CONSTRAINT "FK_8192da2267127f1b2ada65354e4"`,
    );
    await queryRunner.query(`DROP TABLE "kedu"."ai_tool"`);
    await queryRunner.query(`DROP TABLE "kedu"."user"`);
  }
}
