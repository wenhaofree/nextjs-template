# 引用依赖：
- 引用shadcnUI
    - npm install shadcn-ui
    - npx shadcn@latest init -d

- 引用Clerk：
    - 参见官网： https://dashboard.clerk.com/


# 开发流程:
## 开发注意:
1. 不要轻易修改package.json的版本依赖. 应用了最新Next.js15版本

## 页面:
1. V0网站; 根据图片附近和AI描述生成React的代码
2. 复制到tsx中,直接Cursor对话完善

## 逻辑:
1. 提交:标题和URL
2. 存储: 人工校验: 图片,修改有效状态;
3. 列表排序


## TODO:
1. 提交AI页面✅
    - 提交数据如何存储? Neon-谷歌账号
    - 数据分类:
        - 固定分类, 然后llm解析网址,添加分类标签
    - 数据缓存✅
        - 定时更新缓存数据

2. 价格页面-验证支付
    -stripe配置测试环境
    - 测试支付成功
    - 成功后修改账号级别
    - 保存数据
3. logo
4. 广告置顶-付费
5. 博客功能-付费增加博客推荐
6. 底部页面
7. 国际化语言功能
8. 法律条款和隐私政策
9. 社交账号关联
10. Card详情页面
11. 详情的社交媒体分享功能
12. 404页面,500页面

单独网站:
1. 输入网址就可以截屏的SaaS. 对标: 
2. 在线工具集SaaS. 对标: 
3. 



## 功能描述:
2024年11月15日.
1. 验证支付流程


2024年11月14日.
1. 用户支付提交流程;
2. 回显支付提示
3. 数据保存

2024年11月13日.
1. 网站数据增加Neon数据库和markdown文件处理
2. 工具列表和工具详情页面

2024年11月11日.
1. 对标导航网站: https://www.toolify.ai/zh/most-used
2. 增加分类功能
3. 需要挖掘有效关键词;

2024年11月10日. 
1. 增加主页面的AIwith.me的主页;
2. 修正Clerk的登录注册; 注意注册时候发送邮件的表头;




## SQL脚本:
````
CREATE TABLE tools (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    image_url VARCHAR(512),
    summary VARCHAR(1000),
    tags VARCHAR(255) DEFAULT '',
    language_support VARCHAR(100) DEFAULT '',
    favorite_count INTEGER DEFAULT 0,
    content_markdown TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active',
    view_count INTEGER DEFAULT 0,
    price_type VARCHAR(20) DEFAULT 'free',
    submit_user_id BIGINT,
    last_check_time TIMESTAMPTZ,
    rating NUMERIC(3,2) DEFAULT 0.0,

    -- 约束
    CONSTRAINT url_unique UNIQUE (url),
    CONSTRAINT rating_range CHECK (rating >= 0 AND rating <= 5.0),
    CONSTRAINT status_values CHECK (status IN ('active', 'inactive', 'pending', 'removed', 'featured')),
    CONSTRAINT price_type_values CHECK (price_type IN ('free', 'paid', 'freemium'))
);

-- 创建索引
CREATE INDEX idx_tools_created_at ON tools(created_at);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_submit_user_id ON tools(submit_user_id);
CREATE INDEX idx_tools_tags ON tools(tags);
CREATE INDEX idx_tools_price_type ON tools(price_type);

-- 更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 添加表注释
COMMENT ON TABLE tools IS 'AI工具导航数据表';

-- 添加字段注释
COMMENT ON COLUMN tools.id IS '主键ID';
COMMENT ON COLUMN tools.title IS '工具名称';
COMMENT ON COLUMN tools.url IS '工具网站链接';
COMMENT ON COLUMN tools.image_url IS '工具封面图片链接';
COMMENT ON COLUMN tools.summary IS '工具简介描述';
COMMENT ON COLUMN tools.tags IS '标签，多个标签用逗号分隔，如：AI绘画,图片处理,设计';
COMMENT ON COLUMN tools.language_support IS '支持的语言，多个语言用逗号分隔，如：中文,英文';
COMMENT ON COLUMN tools.favorite_count IS '收藏数量';
COMMENT ON COLUMN tools.content_markdown IS '工具详细介绍(Markdown格式)';
COMMENT ON COLUMN tools.created_at IS '创建时间';
COMMENT ON COLUMN tools.updated_at IS '更新时间';
COMMENT ON COLUMN tools.status IS '状态(active:正常 inactive:无效 pending:待审核 removed:下架 featured:推荐)';
COMMENT ON COLUMN tools.view_count IS '浏览量';
COMMENT ON COLUMN tools.price_type IS '价格类型(free:免费 paid:付费 freemium:部分付费)';
COMMENT ON COLUMN tools.submit_user_id IS '提交用户ID';
COMMENT ON COLUMN tools.last_check_time IS '最后检测时间';
COMMENT ON COLUMN tools.rating IS '平均评分(0-5分)';

-- 插入测试数据示例
INSERT INTO tools (
    title,
    url,
    image_url,
    summary,
    tags,
    language_support,
    content_markdown,
    price_type,
    rating
) VALUES (
    'Midjourney',
    'https://www.midjourney.com',
    'https://example.com/midjourney.jpg',
    'AI图像生成工具，通过文本描述生成高质量图片',
    'AI绘画,图像生成,创意设计',
    '英文',
    '# Midjourney\n\nMidjourney是一款强大的AI图像生成工具...',
    'freemium',
    4.8
);

````