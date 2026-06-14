-- =====================================================
-- 不動産管理アプリ：物件テーブルと RLS ポリシー
-- Supabase ダッシュボード → SQL Editor に貼り付けて実行する
-- ※ 何度実行しても安全（IF NOT EXISTS / DROP POLICY IF EXISTS 対応）
-- =====================================================

-- 物件テーブルを作成する（既存の場合はスキップ）
CREATE TABLE IF NOT EXISTS properties (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,                    -- 物件名
  rent        INTEGER     NOT NULL CHECK (rent >= 0),  -- 家賃（円）
  area        TEXT        NOT NULL,                    -- エリア名
  floor_plan  TEXT        NOT NULL,                    -- 間取り（例：1LDK）
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- テーブルにコメントを付与する
COMMENT ON TABLE  properties             IS '不動産物件マスタ';
COMMENT ON COLUMN properties.user_id    IS '登録したユーザーの ID（auth.users と紐付け）';
COMMENT ON COLUMN properties.name       IS '物件名';
COMMENT ON COLUMN properties.rent       IS '月額家賃（円）';
COMMENT ON COLUMN properties.area       IS 'エリア名（例：大阪市北区）';
COMMENT ON COLUMN properties.floor_plan IS '間取り（例：1LDK）';

-- =====================================================
-- Row Level Security（行レベルセキュリティ）を有効化する
-- =====================================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- 既存ポリシーを一旦削除してから再作成する（冪等性のため）
DROP POLICY IF EXISTS "自分の物件を参照できる"  ON properties;
DROP POLICY IF EXISTS "自分の物件を登録できる"  ON properties;
DROP POLICY IF EXISTS "自分の物件を更新できる"  ON properties;
DROP POLICY IF EXISTS "自分の物件を削除できる"  ON properties;

-- 自分が登録した物件のみ参照できるポリシー
CREATE POLICY "自分の物件を参照できる"
  ON properties FOR SELECT
  USING (auth.uid() = user_id);

-- 自分の user_id でのみ INSERT できるポリシー
CREATE POLICY "自分の物件を登録できる"
  ON properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 自分が登録した物件のみ更新できるポリシー
CREATE POLICY "自分の物件を更新できる"
  ON properties FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 自分が登録した物件のみ削除できるポリシー
CREATE POLICY "自分の物件を削除できる"
  ON properties FOR DELETE
  USING (auth.uid() = user_id);
