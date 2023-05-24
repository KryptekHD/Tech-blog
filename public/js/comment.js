user_id = null;

const postHandler = async (event) => {
  event.preventDefault();
  const comment = document.querySelector(".user-comment").value;
  if (event.target.hasAttribute("data-id")) {
    const post_id = event.target.getAttribute("data-id");

    const response = await fetch(`/api/comment/${post_id}/post`, {
      method: "POST",
      body: JSON.stringify({
        comment,
        food_id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      document.location.reload(true);
    } else {
      alert("Failed to create comment");
    }
  }
};

document
  .querySelector(".comment-button")
  .addEventListener("click", postHandler);
