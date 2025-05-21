export async function POST(req) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { text, voice } = await req.json();
    const MAX_LENGTH = 4096;

    const chunks = [];
    let start = 0;
    while (start < text.length) {
      chunks.push(text.slice(start, start + MAX_LENGTH));
      start += MAX_LENGTH;
    }

    const audioBuffers = [];

    for (const chunk of chunks) {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "tts-1",
          input: chunk,
          voice,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch audio from OpenAI");
      }

      const buffer = await response.arrayBuffer();
      audioBuffers.push(buffer);
    }

     const combined = new Uint8Array(audioBuffers.reduce((acc, buf) => acc + buf.byteLength, 0));
    let offset = 0;
    for (const buffer of audioBuffers) {
      combined.set(new Uint8Array(buffer), offset);
      offset += buffer.byteLength;
    }

    return new Response(combined, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate audio" },
      { status: 500 }
    );
  }
}
