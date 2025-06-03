import { useState, useRef, useEffect } from 'react';
import {
  Box, Container, Paper, Stack, Avatar, Typography, TextField, IconButton, keyframes
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import axios from 'axios';

const typingAnimation = keyframes`
  0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; }
`;
const TypingDot = styled('div')(({ theme }) => ({
  width: '8px', height: '8px', backgroundColor: theme.palette.text.secondary,
  borderRadius: '50%', margin: '0 3px', animation: `${typingAnimation} 1.5s infinite ease-in-out`,
}));
const MessageBubble = styled(Paper)(({ theme, sender }) => ({
  padding: theme.spacing(1, 2), borderRadius: '20px', maxWidth: '75%',
  backgroundColor: sender === 'user' ? theme.palette.primary.main : theme.palette.background.paper,
  color: sender === 'user' ? theme.palette.primary.contrastText : theme.palette.text.primary,
  boxShadow: '0 2px 5px rgba(0,0,0,0.1)', wordWrap: 'break-word',
}));
const CodeBlockWrapper = styled('div')({
  margin: '8px 0', borderRadius: '8px', overflow: 'hidden',
});

const CodeBlock = ({ language, value }) => (
  <CodeBlockWrapper>
    <SyntaxHighlighter language={language} style={atomDark} showLineNumbers>
      {String(value).replace(/\n$/, '')}
    </SyntaxHighlighter>
  </CodeBlockWrapper>
);
const TypingIndicator = () => (
  <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: '48px', my: 2 }}>
    <TypingDot sx={{ animationDelay: '0s' }} />
    <TypingDot sx={{ animationDelay: '0.2s' }} />
    <TypingDot sx={{ animationDelay: '0.4s' }} />
  </Stack>
);

const OpenAiChat = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Xin chào! Bạn cần tôi giúp gì hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('open-chat', {
        prompt: currentInput
      });

      const aiResponseText = response.data;
      const aiMessage = { sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      let errorMessageText = "Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.";

      if (error.response) {
        console.error("Data:", error.response.data);
        console.error("Status:", error.response.status);
        errorMessageText = `Lỗi từ server: ${error.response.status}${error.response.data ? ` - ${typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)}` : ''}`;

      } else if (error.request) {
        console.error("Request:", error.request);
        errorMessageText = "Không thể kết nối đến server. Vui lòng kiểm tra lại đường truyền mạng.";
      } else {
        console.error('Error', error.message);
        errorMessageText = `Lỗi thiết lập yêu cầu: ${error.message}`;
      }

      const errorMessage = { sender: 'ai', text: errorMessageText };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const parseMessage = (text) => {
    const parts = text.split(/(```[\w\s]*\n[\s\S]*?\n```)/g);
    return parts.map((part, index) => {
      const codeBlockMatch = part.match(/```(\w+)?\n([\s\S]*?)\n```/);
      if (codeBlockMatch) {
        const language = codeBlockMatch[1] || 'text';
        const code = codeBlockMatch[2];
        return <CodeBlock key={index} language={language} value={code} />;
      }
      return part ? <Typography key={index} variant="body1" component="span" sx={{ whiteSpace: 'pre-wrap' }}>{part}</Typography> : null;
    });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ height: '85vh', display: 'flex', flexDirection: 'column', borderRadius: '16px' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          <Stack spacing={2}>
            {messages.map((msg, index) => (
              <Stack
                key={index} direction="row" spacing={1.5}
                alignItems="flex-start"
                justifyContent={msg.sender === 'user' ? 'flex-end' : 'flex-start'}
              >
                {msg.sender === 'ai' && <Avatar sx={{ bgcolor: 'secondary.main' }}><SmartToyIcon /></Avatar>}
                <MessageBubble sender={msg.sender}>{parseMessage(msg.text)}</MessageBubble>
                {msg.sender === 'user' && <Avatar sx={{ bgcolor: 'primary.main' }}><PersonIcon /></Avatar>}
              </Stack>
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </Stack>
        </Box>
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Paper component="form" elevation={0} variant='outlined' sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', borderRadius: '12px' }}>
            <TextField
              fullWidth multiline maxRows={5} variant="standard" placeholder="Nhập câu hỏi của bạn..."
              value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress}
              sx={{ ml: 1, border: 'none' }} InputProps={{ disableUnderline: true }}
            />
            <IconButton color="primary" sx={{ p: '10px' }} onClick={handleSend} disabled={isLoading}>
              <SendIcon />
            </IconButton>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default OpenAiChat;