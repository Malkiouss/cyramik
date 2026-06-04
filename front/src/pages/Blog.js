import BlogCard from '../components/BlogCard';
import { posts } from '../data/siteData';

const Blog = () => (
  <main className="page page-offset">
    <section className="page-hero">
      <span className="eyebrow">Blog</span>
      <h1>Blog</h1>
      <p>Gestes d atelier, recettes, inspirations de saison et histoires derriere les pieces.</p>
    </section>
    <div className="cards-grid">{posts.map((post) => <BlogCard key={post._id} post={post} />)}</div>
  </main>
);

export default Blog;
