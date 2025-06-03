const { app } = require('@azure/functions');
const { AzureOpenAI } = require("openai");

const endpoint = process.env.OPENAI_API_ENDPOINT;
const apiKey = process.env.OPENAI_API_KEY;
const deployment = "gpt-35-turbo";
if (!endpoint || !apiKey) {
    throw new Error("Vui lòng cấu hình OPENAI_API_ENDPOINT và OPENAI_API_KEY trong Application Settings.");
}

const client = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion: "2024-02-01",
    deployment,
});

app.http('openAlchat', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'openai-chat',
    handler: async (request, context) => {
        context.log(`HTTP trigger function processed a request for url "${request.url}"`);

        try {
            const { prompt } = await request.json();

            if (!prompt) {
                context.log.warn("Request không có prompt.");
                return {
                    status: 400,
                    body: "Vui lòng gửi 'prompt' trong body của request."
                };
            }
            const response = await client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt }
                ],
                model: deployment,
            });

            const responseMessage = response.choices[0]?.message?.content;
            return {
                body: responseMessage
            };

        } catch (error) {
            context.log.error("Lỗi khi gọi Azure OpenAI hoặc xử lý request:", error);
            return {
                status: 500,
                body: "Đã có lỗi xảy ra phía server."
            };
        }
    }
});