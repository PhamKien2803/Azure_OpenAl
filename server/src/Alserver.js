const { AzureOpenAI } = require("openai");
const endpoint = process.env.OPENAI_API_ENDPOINT;
const apiKey = process.env.OPENAI_API_KEY;
const deployment = "gpt-35-turbo";
if (!endpoint || !apiKey) {
    throw new Error("Vui lòng cấu hình OPENAI_API_ENDPOINT và OPENAI_API_KEY.");
}
const client = new AzureOpenAI({
    endpoint,
    apiKey,
    apiVersion: "2024-02-01",
    deployment
});

module.exports = async function (context, req) {
    context.log('Function đã nhận được một yêu cầu.');

    const prompt = req.body?.prompt;

    if (!prompt) {
        context.res = {
            status: 400,
            body: "Vui lòng gửi 'prompt' trong body của request."
        };
        return;
    }

    try {
        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
            model: deployment,
        });

        context.res = {
            body: response.choices[0]?.message?.content
        };

    } catch (error) {
        context.log.error("Lỗi khi gọi Azure OpenAI:", error);
        context.res = {
            status: 500,
            body: "Đã có lỗi xảy ra phía server."
        };
    }
};