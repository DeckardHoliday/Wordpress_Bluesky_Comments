async function resolveAtUriFromBskyUrl(url) {

  const regex = /https:\/\/bsky\.app\/profile\/([^/]+)\/post\/([^/]+)/;
  const match = url.match(regex);

  if (!match) throw new Error("Invalid Bluesky URL format");

  const [_, handle, rkey] = match;

  const res = await fetch(`https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`);

  if (!res.ok) throw new Error("Failed to resolve handle");

  const data = await res.json();

  if (!data.did) throw new Error("No DID found for handle");

  return `at://${data.did}/app.bsky.feed.post/${rkey}`;

}

async function getPostThread(uri) {

  const res = await fetch(
    `https://public.api.bsky.app/xrpc/app.bsky.feed.getPostThread?uri=${encodeURIComponent(uri)}`,
    { headers: { Accept: "application/json" }, cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch post thread");

  const data = await res.json();

  if (!data.thread?.post) throw new Error("Invalid thread data");

  return data.thread;

}

function createCommentElement(reply, attributes) {

  const {
    avatar_size,
    username_font_size,
    comment_font_size,
    comment_container_width,
    comment_padding_y,
    comment_padding_x,
    comment_margin_y,
    avatar_margin_right,
    comment_text_padding_left,
    hide_post_stats,
    show_nested_replies,
    bg_transparent
  } = attributes;

  const author = reply.post.author;
  const avatar_url = author.avatar ?? 'https://bsky.social/img/default_avatar.png';

  const comment_el = document.createElement("div");

  comment_el.className = 'bsky-comment-item';

  // Transparent background handling: remove background and border if enabled
  if (bg_transparent) {

    comment_el.style.backgroundColor = 'transparent';
    comment_el.style.border = 'none';

  } else {

    comment_el.style.backgroundColor = '#fafafa';
    comment_el.style.border = '1px solid #ddd';

  }

  comment_el.style.maxWidth = comment_container_width + 'px';
  comment_el.style.padding = `${comment_padding_y}px ${comment_padding_x}px`;
  comment_el.style.margin = `${comment_margin_y}px 0`;

  const author_container = document.createElement("div");

  author_container.className = 'bsky-comment-author';

  const avatar_img = document.createElement("img");

  avatar_img.className = 'bsky-comment-avatar';
  avatar_img.src = avatar_url;
  avatar_img.alt = `${author.handle} avatar`;
  avatar_img.style.width = avatar_size + 'px';
  avatar_img.style.height = avatar_size + 'px';
  avatar_img.style.marginRight = avatar_margin_right + 'px';

  const author_link = document.createElement("a");

  author_link.className = 'bsky-comment-author-name';
  author_link.href = `https://bsky.app/profile/${author.did}`;
  author_link.target = '_blank';
  author_link.rel = 'noopener noreferrer';
  author_link.style.fontSize = username_font_size + 'px';
  author_link.textContent = `${author.displayName ?? author.handle} (@${author.handle})`;

  author_container.appendChild(avatar_img);
  author_container.appendChild(author_link);

  const comment_text = document.createElement("p");

  comment_text.className = 'bsky-comment-text';
  comment_text.style.fontSize = comment_font_size + 'px';
  comment_text.style.paddingLeft = comment_text_padding_left + 'px';
  comment_text.textContent = reply.post.record?.text ?? '';

  comment_el.appendChild(author_container);
  comment_el.appendChild(comment_text);

  if (!hide_post_stats) {

    const post_stats = document.createElement('a');
    post_stats.href = `https://bsky.app/profile/${author.handle}/post/${reply.post.uri.split('/').pop()}`;
    post_stats.target = '_blank';
    post_stats.rel = 'noopener noreferrer';
    post_stats.className = 'bsky-main-post-link';
    post_stats.style.marginTop = '0.5rem';
    post_stats.textContent = `❤️ ${reply.post.likeCount ?? 0} likes | 🔁 ${reply.post.repostCount ?? 0} reposts | 💬 ${reply.post.replyCount ?? 0} replies`;
    comment_el.appendChild(post_stats);

  }

  const comment_divider = document.createElement('hr');

  comment_divider.className = 'bsky-comment-divider';
  comment_el.appendChild(comment_divider);

  if (show_nested_replies && reply.replies && reply.replies.length > 0) {

    const nested_container = document.createElement('div');
    nested_container.style.marginLeft = '1.5rem';
    nested_container.style.marginTop = '0.75rem';

    reply.replies.forEach(nestedReply => {

      const nested_comment_el = createCommentElement(nestedReply, attributes);
      nested_container.appendChild(nested_comment_el);

    });

    comment_el.appendChild(nested_container);

  }

  return comment_el;

}

function renderComments(container, thread) {

  const post = thread.post;
  const replies = thread.replies ?? [];

  const bg_color = container.dataset.bg_color ?? '#f9f9f9';
  const bg_transparent = container.dataset.bg_transparent === 'true';
  const avatar_size = parseInt(container.dataset.avatar_size) ?? 40;
  const username_font_size = parseInt(container.dataset.username_font_size) ?? 16;
  const comment_font_size = parseInt(container.dataset.comment_font_size) ?? 14;
  const hide_post_stats = container.dataset.hide_post_stats === 'true';
  const container_max_width = parseInt(container.dataset.container_max_width) ?? 600;
  const comment_container_width = parseInt(container.dataset.comment_container_width) ?? 550;
  const container_padding_y = parseInt(container.dataset.container_padding_y) ?? 16;
  const container_padding_x = parseInt(container.dataset.container_padding_x) ?? 16;
  const container_margin_y = parseInt(container.dataset.container_margin_y) ?? 16;
  const container_margin_x = container.dataset.container_margin_x ?? 'auto';
  const comment_padding_y = parseInt(container.dataset.comment_padding_y) ?? 12;
  const comment_padding_x = parseInt(container.dataset.comment_padding_x) ?? 16;
  const comment_margin_y = parseInt(container.dataset.comment_margin_y) ?? 16;
  const avatar_margin_right = parseInt(container.dataset.avatar_margin_right) ?? 12;
  const comment_text_padding_left = parseInt(container.dataset.comment_text_padding_left) ?? 8;
  const show_nested_replies = container.dataset.show_nested_replies === 'true';

  // Container styling: transparent or colored
  if (bg_transparent) {

    container.style.boxShadow = 'none !important';
    container.style.backgroundColor = 'transparent';
    container.style.border = 'none';

  } else {

    container.style.backgroundColor = bg_color;
    container.style.border = '1px solid #ccc';

  }

  container.style.padding = `${container_padding_y}px ${container_padding_x}px`;
  container.style.borderRadius = '6px';
  container.style.maxWidth = container_max_width + 'px';
  container.style.margin = `${container_margin_y}px ${container_margin_x}`;

  container.innerHTML = `
    ${
      hide_post_stats ? '' : `<a href="https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}" target="_blank" rel="noopener noreferrer" class="bsky-main-post-link">
        ❤️ ${post.likeCount ?? 0} likes | 🔁 ${post.repostCount ?? 0} reposts | 💬 ${post.replyCount ?? 0} replies
      </a>`
    }
    <h3>Comments</h3>
    <p><a href="https://bsky.app/profile/${post.author.handle}/post/${post.uri.split('/').pop()}" target="_blank" rel="noopener noreferrer">Reply on Bluesky</a> to join the conversation.</p>
    <div id="bluesky-comment-list" class="bsky-comment-list"></div>
  `;

  const listEl = container.querySelector("#bluesky-comment-list");

  replies.forEach(reply => {
    const commentEl = createCommentElement(reply, {
      avatar_size,
      username_font_size,
      comment_font_size,
      comment_container_width,
      comment_padding_y,
      comment_padding_x,
      comment_margin_y,
      avatar_margin_right,
      comment_text_padding_left,
      hide_post_stats,
      show_nested_replies,
      bg_transparent
    });

    listEl.appendChild(commentEl);

  });

}

async function init() {

  const container = document.getElementById("bluesky_comments");
  if (!container) return;

  const url = container.dataset.url;

  if (!url) {

    container.innerHTML = "<p>Error: No Bluesky URL provided.</p>";
    return;

  }

  try {

    const atUri = await resolveAtUriFromBskyUrl(url);
    const thread = await getPostThread(atUri);
    renderComments(container, thread);

  } catch (err) {

    container.innerHTML = `<p>Error loading comments: ${err.message}</p>`;
    console.error(err);

  }

}

document.addEventListener("DOMContentLoaded", init);
