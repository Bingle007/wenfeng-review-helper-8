const handleGenerateReview = async () => {
  const res = await fetch('/api/generate-review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: text, template: selectedTemplate }),
  });

  const data = await res.json();
  setReview(data.review);
};
