const {registerBlockType} = wp.blocks;
const {TextControl, ColorPicker, PanelBody, ToggleControl, RangeControl} = wp.components;
const {InspectorControls} = wp.blockEditor;
const {createElement: el, Fragment} = wp.element;


// Icon by Font Awesome Free v7.0.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.
const bsky_icon = {
  src: el(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 576 512',
      },
      el('path', {
        d: 'M407.8 294.7c-3.3-.4-6.7-.8-10-1.3 3.4 .4 6.7 .9 10 1.3zM288 227.1C261.9 176.4 190.9 81.9 124.9 35.3 61.6-9.4 37.5-1.7 21.6 5.5 3.3 13.8 0 41.9 0 58.4S9.1 194 15 213.9c19.5 65.7 89.1 87.9 153.2 80.7 3.3-.5 6.6-.9 10-1.4-3.3 .5-6.6 1-10 1.4-93.9 14-177.3 48.2-67.9 169.9 120.3 124.6 164.8-26.7 187.7-103.4 22.9 76.7 49.2 222.5 185.6 103.4 102.4-103.4 28.1-156-65.8-169.9-3.3-.4-6.7-.8-10-1.3 3.4 .4 6.7 .9 10 1.3 64.1 7.1 133.6-15.1 153.2-80.7 5.9-19.9 15-138.9 15-155.5s-3.3-44.7-21.6-52.9c-15.8-7.1-40-14.9-103.2 29.8-66.1 46.6-137.1 141.1-163.2 191.8z',
      })
  ),
  foreground: '#1185FE',
};

registerBlockType('bluesky/comments', {
  title: 'Bluesky Comments',
  icon: bsky_icon,
  category: 'widgets',
  attributes: {
    url: {type: 'string', default: ''},
    bg_color: {type: 'string', default: '#f9f9f9'},
    bg_transparent: {type: 'boolean', default: false},
    avatar_size: {type: 'number', default: 40},
    username_font_size: {type: 'number', default: 16},
    comment_font_size: {type: 'number', default: 14},
    hide_post_stats: {type: 'boolean', default: false},
    container_max_width: {type: 'number', default: 600},
    comment_container_width: {type: 'number', default: 550},
    container_padding_y: {type: 'number', default: 16},
    container_padding_x: {type: 'number', default: 16},
    container_margin_y: {type: 'number', default: 16},
    container_margin_x: {type: 'string', default: 'auto'},
    comment_padding_y: {type: 'number', default: 12},
    comment_padding_x: {type: 'number', default: 16},
    comment_margin_y: {type: 'number', default: 16},
    avatar_margin_right: {type: 'number', default: 12},
    comment_text_padding_left: {type: 'number', default: 8},
    show_nested_replies: {type: 'boolean', default: false},
  },
  edit: ({attributes, setAttributes}) => {
    return el(Fragment, {},
        el(InspectorControls, {},
            el(PanelBody, {title: 'Settings', initialOpen: true},
                el(TextControl, {
                  label: 'Bluesky Post URL',
                  value: attributes.url,
                  onChange: (value) => setAttributes({url: value}),
                  placeholder: 'https://bsky.app/profile/[user_handle]/post/[post_did]',
                }),
                el('div', {style: {marginTop: '1em'}},
                    el('label', {style: {display: 'block', marginBottom: '0.25em'}}, 'Background Color'),
                    el(ColorPicker, {
                      color: attributes.bg_color,
                      onChangeComplete: (color) => setAttributes({bg_color: color.hex}),
                      disableAlpha: true,
                    }),
                ),
                el(ToggleControl, {
                  label: 'Hide Likes/Retweets Section',
                  checked: attributes.hide_post_stats,
                  onChange: (value) => setAttributes({hide_post_stats: value}),
                }),
                el(ToggleControl, {
                  label: 'Show Nested Replies',
                  checked: attributes.show_nested_replies,
                  onChange: (value) => setAttributes({show_nested_replies: value}),
                }),
                el(ToggleControl, {
                  label: 'Use Transparent Background',
                  checked: attributes.bg_transparent,
                  onChange: (value) => setAttributes({bg_transparent: value}),
                }),
                el(RangeControl, {
                  label: 'Avatar Image Size (px)',
                  value: attributes.avatar_size,
                  onChange: (value) => setAttributes({avatar_size: value}),
                  min: 20,
                  max: 100,
                }),
                el(RangeControl, {
                  label: 'Username Font Size (px)',
                  value: attributes.username_font_size,
                  onChange: (value) => setAttributes({username_font_size: value}),
                  min: 10,
                  max: 32,
                }),
                el(RangeControl, {
                  label: 'Comment Text Font Size (px)',
                  value: attributes.username_font_size,
                  onChange: (value) => setAttributes({username_font_size: value}),
                  min: 10,
                  max: 24,
                }),
                el(RangeControl, {
                  label: 'Container Max Width (px)',
                  value: attributes.container_max_width,
                  onChange: (value) => setAttributes({container_max_width: value}),
                  min: 300,
                  max: 1200,
                }),
                el(RangeControl, {
                  label: 'Comment Container Max Width (px)',
                  value: attributes.comment_container_width,
                  onChange: (value) => setAttributes({comment_container_width: value}),
                  min: 200,
                  max: 1000,
                }),
                el(RangeControl, {
                  label: 'Parent Container Padding Vertical (px)',
                  value: attributes.container_padding_y,
                  onChange: (value) => setAttributes({container_padding_y: value}),
                  min: 0,
                  max: 100,
                }),
                el(RangeControl, {
                  label: 'Parent Container Padding Horizontal (px)',
                  value: attributes.container_padding_x,
                  onChange: (value) => setAttributes({container_padding_x: value}),
                  min: 0,
                  max: 100,
                }),
                el(RangeControl, {
                  label: 'Parent Container Margin Vertical (px)',
                  value: attributes.container_margin_y,
                  onChange: (value) => setAttributes({container_margin_y: value}),
                  min: 0,
                  max: 100,
                }),
                el(TextControl, {
                  label: 'Parent Container Margin Horizontal',
                  value: attributes.container_margin_x,
                  onChange: (value) => setAttributes({container_margin_x: value}),
                  placeholder: 'auto or px value',
                }),
                el(RangeControl, {
                  label: 'Comment Padding Vertical (px)',
                  value: attributes.comment_padding_y,
                  onChange: (value) => setAttributes({comment_padding_y: value}),
                  min: 0,
                  max: 100,
                }),
                el(RangeControl, {
                  label: 'Comment Padding Horizontal (px)',
                  value: attributes.comment_padding_x,
                  onChange: (value) => setAttributes({comment_padding_x: value}),
                  min: 0,
                  max: 100,
                }),
                el(RangeControl, {
                  label: 'Comment Margin Vertical (px)',
                  value: attributes.comment_margin_y,
                  onChange: (value) => setAttributes({comment_margin_y: value}),
                  min: 0,
                  max: 100,
                }),
                el(RangeControl, {
                  label: 'Avatar Margin Right (px)',
                  value: attributes.avatar_margin_right,
                  onChange: (value) => setAttributes({avatar_margin_right: value}),
                  min: 0,
                  max: 50,
                }),
                el(RangeControl, {
                  label: 'Comment Text Padding Left (px)',
                  value: attributes.comment_text_padding_left,
                  onChange: (value) => setAttributes({comment_text_padding_left: value}),
                  min: 0,
                  max: 50,
                }),
            )
        ),
        el('div', {
          style: {
            backgroundColor: attributes.bg_transparent ? 'transparent' : attributes.bg_color,
            padding: `${attributes.container_padding_y}px ${attributes.container_padding_x}px`,
            borderRadius: '6px',
            minHeight: '80px',
            border: attributes.bg_transparent ? 'none' : '1px solid #ccc',
            color: '#666',
            maxWidth: attributes.container_max_width + 'px',
            margin: `${attributes.container_margin_y}px ${attributes.container_margin_x}`,
            fontStyle: 'italic',
          }
        }, attributes.url ? `Bluesky Post URL set.` : 'Bluesky Post URL: Not set')
    );
  },
  save: () => null,
});
