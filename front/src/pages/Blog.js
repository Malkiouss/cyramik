import { Link, useParams } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { useBlog, useBlogs } from '../hooks/useBlogs';
import './Blog.css';

const getBlogImage = (post) => post.coverImage || post.imageUrl || '/assets/exper1.jpg';

const BlogList = () => {
  const { data: posts = [], isLoading, isError } = useBlogs();

  return (
    <main className="page page-offset">
      <section className="page-hero">
        <span className="eyebrow">Blog</span>
        <h1>Blog</h1>
        <p>Gestes d atelier, recettes, inspirations de saison et histoires derriere les pieces.</p>
      </section>

      {isLoading && <div className="cards-grid">{[0, 1, 2].map((item) => <span className="item-card blog-card blog-card--loading" key={item} />)}</div>}
      {!isLoading && isError && <p className="page-message">Impossible de charger les articles pour le moment.</p>}
      {!isLoading && !isError && posts.length === 0 && <p className="page-message">Aucun article publie pour le moment.</p>}
      {!isLoading && !isError && posts.length > 0 && (
        <div className="cards-grid">{posts.map((post) => <BlogCard key={post.id || post._id} post={post} />)}</div>
      )}
    </main>
  );
};

const BlogDetail = ({ slug }) => {
  const { data: post, isLoading, isError } = useBlog(slug);

  if (isLoading) {
    return (
      <main className="blog-detail-page page-offset">
        <div className="blog-detail-loading" />
      </main>
    );
  }

  if (isError || !post) {
    return (
      <main className="blog-detail-page page-offset">
        <section className="blog-detail-empty">
          <span className="eyebrow">Blog</span>
          <h1>Article introuvable</h1>
          <p>Cet article n'est pas disponible ou n'est pas encore publie.</p>
          <Link className="btn btn-primary" to="/blog">Retour blog</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="blog-detail-page page-offset">
      <article className="blog-detail-article">
        <Link className="blog-detail-back" to="/blog">Retour blog</Link>
        <span className="eyebrow">Journal du studio</span>
        <h1>{post.title}</h1>
        {post.excerpt && <p className="blog-detail-excerpt">{post.excerpt}</p>}
        <img src={getBlogImage(post)} alt={post.title} />
        <div className="blog-detail-content">
          {(post.content || '').split('\n').filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </article>
    </main>
  );
};

const Blog = () => {
  const { slug } = useParams();
  return slug ? <BlogDetail slug={slug} /> : <BlogList />;
};

export default Blog;
