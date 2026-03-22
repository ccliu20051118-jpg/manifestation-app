"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/knowledge.json").then(r => r.json()).then(data => {
      const cat = data.categories.find(c => c.id === params.categoryId);
      if (cat) { setCategory(cat); setArticle(cat.articles.find(a => a.id === params.articleId) || null); }
      setLoading(false);
    });
  }, [params.categoryId, params.articleId]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div></div>;
  if (!article || !category) return <div className="max-w-lg mx-auto px-5 pt-8 text-center"><p className="text-text-sub">找不到這篇文章</p><Link href="/dashboard/knowledge" className="text-primary mt-4 inline-block">← 返回知識模組</Link></div>;

  const sorted = category.articles.sort((a, b) => a.order - b.order);
  const idx = sorted.findIndex(a => a.id === article.id);
  const prev = idx > 0 ? sorted[idx - 1] : null;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const paragraphs = article.content.split("\n\n").filter(p => p.trim());

  return (
    <div className="max-w-lg mx-auto px-5 pt-6 pb-8">
      <button onClick={() => router.back()} className="text-text-sub text-sm hover:text-primary mb-6 inline-block">← {category.title}</button>
      <h1 className="text-2xl font-bold text-text-main mb-2">{article.title}</h1>
      {article.source && <p className="text-text-sub text-xs mb-6 italic">{article.source}</p>}
      <div className="space-y-4 mb-8">
        {paragraphs.map((para, i) => <p key={i} className="text-text-main text-sm leading-relaxed">{para.trim()}</p>)}
      </div>
      {article.externalLinks && article.externalLinks.length > 0 && (
        <div className="bg-primary/5 rounded-2xl p-5 mb-8 border border-primary/10">
          <p className="text-text-sub text-xs mb-3">📎 延伸閱讀</p>
          {article.externalLinks.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="block text-primary text-sm hover:text-primary-dark mb-1">{link.title} →</a>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        {prev ? <Link href={`/dashboard/knowledge/${category.id}/${prev.id}`} className="text-text-sub text-sm hover:text-primary">← {prev.title}</Link> : <span></span>}
        {next ? <Link href={`/dashboard/knowledge/${category.id}/${next.id}`} className="text-primary text-sm font-medium">下一篇 →</Link> : <Link href="/dashboard/knowledge" className="text-primary text-sm font-medium">回到知識模組 →</Link>}
      </div>
    </div>
  );
}
