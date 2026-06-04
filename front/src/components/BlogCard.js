import { Link } from 'react-router-dom';

const BlogCard = ({ post }) => (
  <article className="item-card">
    <img src={post.imageUrl} alt={post.title} />
    <div>
      <span>Journal du studio</span>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <Link className="text-link" to={`/blog/${post.slug}`}>Lire</Link>
    </div>
  </article>
);

export default BlogCard;
