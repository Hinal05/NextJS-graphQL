export async function createArticle(
  { title, body }: { title: string; body: string },
  csrfToken: string
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}/jsonapi/node/article`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({
      data: {
        type: 'node--article',
        attributes: {
          title,
          body: { value: body, format: 'plain_text' },
        },
      },
    }),
    credentials: 'include',
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Drupal error');
  }

  return res.json();
}