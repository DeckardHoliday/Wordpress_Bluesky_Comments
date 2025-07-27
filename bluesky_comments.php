<?php
/**
 * Plugin Name: Bluesky Comments Viewer
 * Description: Displays comments and stats from a Bluesky post thread from a Bluesky URL.
 * Version: 1.00
 * Author: Deckard Holiday
 */

defined('ABSPATH') or die('rip plugin :(');

function bluesky_comments_register_block() {

    wp_register_script(
        'bluesky-comments-block',
        plugins_url('block.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components'),
        filemtime(plugin_dir_path(__FILE__) . 'block.js'),
        true
    );

    wp_register_script(
        'bluesky-comments-frontend',
        plugins_url('bluesky_comments.js', __FILE__),
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'bluesky_comments.js'),
        true
    );

    wp_register_style(
        'bluesky-comments-style',
        plugins_url('css/bluesky_comments.css', __FILE__),
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'css/bluesky_comments.css')
    );

    register_block_type('bluesky/comments', array(
        'editor_script' => 'bluesky-comments-block',
        'editor_style'  => 'bluesky-comments-style',
        'style'         => 'bluesky-comments-style',
        'render_callback' => 'bluesky_comments_render_callback',
        'attributes' => array(
            'url' => array('type' => 'string', 'default' => ''),
            'bg_color' => array('type' => 'string', 'default' => '#f9f9f9'),
            'bg_transparent' => array('type' => 'boolean', 'default' => false),
            'avatar_size' => array('type' => 'number', 'default' => 40),
            'username_font_size' => array('type' => 'number', 'default' => 16),
            'comment_font_size' => array('type' => 'number', 'default' => 14),
            'hide_post_stats' => array('type' => 'boolean', 'default' => false),
            'container_max_width' => array('type' => 'number', 'default' => 600),
            'comment_container_width' => array('type' => 'number', 'default' => 550),
            'container_padding_y' => array('type' => 'number', 'default' => 16),
            'container_padding_x' => array('type' => 'number', 'default' => 16),
            'container_margin_y' => array('type' => 'number', 'default' => 16),
            'container_margin_x' => array('type' => 'string', 'default' => 'auto'),
            'comment_padding_y' => array('type' => 'number', 'default' => 12),
            'comment_padding_x' => array('type' => 'number', 'default' => 16),
            'comment_margin_y' => array('type' => 'number', 'default' => 16),
            'avatar_margin_right' => array('type' => 'number', 'default' => 12),
            'comment_text_padding_left' => array('type' => 'number', 'default' => 8),
            'show_nested_replies' => array('type' => 'boolean', 'default' => false),
        ),
    ));

}

add_action('init', 'bluesky_comments_register_block');

function bluesky_comments_render_callback($attributes) {

    $url = isset($attributes['url']) ? esc_url($attributes['url']) : '';
    $bg_color = isset($attributes['bg_color']) ? sanitize_hex_color($attributes['bg_color']) : '#f9f9f9';
    $bg_transparent = !empty($attributes['bg_transparent']);
    $avatar_size = isset($attributes['avatar_size']) ? intval($attributes['avatar_size']) : 40;
    $username_font_size = isset($attributes['username_font_size']) ? intval($attributes['username_font_size']) : 16;
    $comment_font_size = isset($attributes['comment_font_size']) ? intval($attributes['comment_font_size']) : 14;
    $hide_post_stats = !empty($attributes['hide_post_stats']) ? 'true' : 'false';
    $container_max_width = isset($attributes['container_max_width']) ? intval($attributes['container_max_width']) : 600;
    $comment_container_width = isset($attributes['comment_container_width']) ? intval($attributes['comment_container_width']) : 550;
    $container_padding_y = isset($attributes['container_padding_y']) ? intval($attributes['container_padding_y']) : 8;
    $container_padding_x = isset($attributes['container_padding_x']) ? intval($attributes['container_padding_x']) : 8;
    $container_margin_y = isset($attributes['container_margin_y']) ? intval($attributes['container_margin_y']) : 8;
    $container_margin_x = isset($attributes['container_margin_x']) ? sanitize_text_field($attributes['container_margin_x']) : 'auto';
    $comment_padding_y = isset($attributes['comment_padding_y']) ? intval($attributes['comment_padding_y']) : 6;
    $comment_padding_x = isset($attributes['comment_padding_x']) ? intval($attributes['comment_padding_x']) : 8;
    $comment_margin_y = isset($attributes['comment_margin_y']) ? intval($attributes['comment_margin_y']) : 8;
    $avatar_margin_right = isset($attributes['avatar_margin_right']) ? intval($attributes['avatar_margin_right']) : 6;
    $comment_text_padding_left = isset($attributes['comment_text_padding_left']) ? intval($attributes['comment_text_padding_left']) : 4;
    $show_nested_replies = !empty($attributes['show_nested_replies']) ? 'true' : 'false';

    if (!$url) {
        return '<p>Please provide a Bluesky post URL in the block settings.</p>';
    }

    ob_start();
    ?>
    <div
        id="bluesky_comments"
        data-url="<?php echo esc_attr($url); ?>"
        data-bg_color="<?php echo esc_attr($bg_color); ?>"
        data-bg_transparent="<?php echo esc_attr($bg_transparent ? 'true' : 'false'); ?>"
        data-avatar_size="<?php echo $avatar_size; ?>"
        data-username_font_size="<?php echo $username_font_size; ?>"
        data-comment_font_size="<?php echo $comment_font_size; ?>"
        data-hide_post_stats="<?php echo esc_attr($hide_post_stats); ?>"
        data-container_max_width="<?php echo $container_max_width; ?>"
        data-comment_container_width="<?php echo $comment_container_width; ?>"
        data-container_padding_y="<?php echo $container_padding_y; ?>"
        data-container_padding_x="<?php echo $container_padding_x; ?>"
        data-container_margin_y="<?php echo $container_margin_y; ?>"
        data-container_margin_x="<?php echo esc_attr($container_margin_x); ?>"
        data-comment_padding_y="<?php echo $comment_padding_y; ?>"
        data-comment_padding_x="<?php echo $comment_padding_x; ?>"
        data-comment_margin_y="<?php echo $comment_margin_y; ?>"
        data-avatar_margin_right="<?php echo $avatar_margin_right; ?>"
        data-comment_text_padding_left="<?php echo $comment_text_padding_left; ?>"
        data-show_nested_replies="<?php echo esc_attr($show_nested_replies); ?>"
        style="
            background-color: <?php echo $bg_transparent ? 'transparent' : $bg_color; ?>;
            padding: <?php echo $container_padding_y; ?>px <?php echo $container_padding_x; ?>px;
            border-radius: 6px;
            max-width: <?php echo $container_max_width; ?>px;
            margin: <?php echo $container_margin_y; ?>px <?php echo esc_attr($container_margin_x); ?>;
            border: <?php echo $bg_transparent ? 'none' : '1px solid #ccc'; ?>;
            box-shadow: <?php echo $bg_transparent ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.1)'; ?>;
        "
    >
        <p>Loading comments...</p>
    </div>
    <?php
    return ob_get_clean();

}

function bluesky_comments_enqueue_frontend_assets() {

    if (!is_admin()) {

        wp_enqueue_script(
            'bluesky-comments-frontend'
        );

        wp_enqueue_style(
            'bluesky-comments-style'
        );

    }

}

add_action('wp_enqueue_scripts', 'bluesky_comments_enqueue_frontend_assets');
