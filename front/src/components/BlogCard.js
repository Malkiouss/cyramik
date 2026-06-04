import { Link } from 'react-router-dom';
import './BlogCard.css';

const getBlogImage = (post) => post.coverImage || post.imageUrl || '/assets/exper1.jpg';

const BlogCard = ({ post }) => (
  <article className="item-card blog-card">
    <img src={getBlogImage(post)} alt={post.title} />
    <div>
      <span>Journal du studio</span>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <Link className="text-link" to={`/blog/${post.slug}`}>Lire</Link>
    </div>
  </article>
);

export default BlogCard;
