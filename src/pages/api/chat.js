// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';

export default async function handler(req, res) {
  const referer = req.headers.referer || req.headers.referrer;

  // Log referer and environment for debugging
  console.log('Referer:', referer);
  console.log('NODE_ENV:', process.env.NODE_ENV);

  // Check if the method is POST
  if (req.method !== 'POST') {
    console.log('Received request method:', req.method);
    return res.status(405).json({ message: 'Method should be POST' });
  }

  // Check if the referer is correct in non-development environments
  if (process.env.NODE_ENV !== "development") {
    if (!referer || referer !== process.env.APP_URL) {
      console.log('Unauthorized access attempt from referer:', referer);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }

  try {
    const { body } = req;
    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    };

    // Make the POST request to the OpenAI API
    const response = await axios.post(url, body, { headers: headers });

    // Log the response data for debugging
    console.log('OpenAI API response:', response.data);

    // Send the response data back to the client
    res.status(200).json(response.data);
  } catch (error) {
    // Log the error and send a generic error message
    console.log('Error during OpenAI API request:', error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
