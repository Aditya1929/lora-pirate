export async function POST(req: Request) {
  const { message } = await req.json()

  if (!process.env.MODAL_API_URL) {
    return Response.json({ response: "Arrr, the seas be troubled! MODAL_API_URL be not set, ye scurvy dog!" })
  }

  try {
    const response = await fetch(process.env.MODAL_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })

    const data = await response.json()
    return Response.json({ response: data.response })
  } catch (error) {
    return Response.json({ response: "Arrr, the kraken got me message! Something went wrong." })
  }
}
