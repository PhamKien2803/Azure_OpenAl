const { app } = require('@azure/functions');
const { AzureOpenAI } = require("openai");

app.http('openai-chat', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Function openai-chat đã nhận được một yêu cầu.`);

        const endpoint = process.env.OPENAI_API_ENDPOINT;
        const apiKey = process.env.OPENAI_API_KEY;
        const deployment = "gpt-35-turbo";

        if (!endpoint || !apiKey) {
            context.log("Thiếu endpoint hoặc apiKey trong môi trường.");
            return {
                status: 500,
                body: "Chưa cấu hình đầy đủ OPENAI_API_ENDPOINT và OPENAI_API_KEY."
            };
        }

        const client = new AzureOpenAI({
            endpoint,
            apiKey,
            apiVersion: "2024-02-01",
        });

        try {
            const { prompt } = await request.json();

            if (!prompt) {
                return { status: 400, body: "Vui lòng gửi 'prompt' trong body của request." };
            }

            const response = await client.chat.completions.create({
                model: deployment,
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 1024,
                temperature: 0.7,
            });

            const responseMessage = response.choices[0]?.message?.content;
            return {
                body: responseMessage
            };

        } catch (error) {
            context.log("Lỗi khi gọi Azure OpenAI:", error);
            return {
                status: 500,
                body: "Đã có lỗi xảy ra phía server khi kết nối đến AI."
            };
        }
    }
});
