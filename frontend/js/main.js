const form = document.querySelector('form');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const content = form.content.value;

  const response = await fetch('/create-post', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (response.ok) {
    // The post was created successfully.
    form.reset();
  } else {
    // There was an error creating the post.
    alert('There was an error creating your post.');
  }
});
