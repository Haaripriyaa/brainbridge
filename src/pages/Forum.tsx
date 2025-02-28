
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { 
  MessageSquare, 
  Send, 
  Users, 
  Clock, 
  ThumbsUp, 
  MessageCircle,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";
import Button from "@/components/Button";
import Input from "@/components/Input";

// Types for our forum data
interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  timestamp: Date;
  likes: number;
  replies: number;
  tags: string[];
}

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  postCount: number;
}

const Forum = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    tagInput: ""
  });

  // Load sample data (in a real app, this would come from an API)
  useEffect(() => {
    // Sample categories
    const sampleCategories: ForumCategory[] = [
      {
        id: "general",
        name: "General Discussion",
        description: "General topics related to studying and academics",
        icon: <MessageSquare size={20} className="text-blue-500" />,
        postCount: 24
      },
      {
        id: "biology",
        name: "Biology",
        description: "Discussions about biology topics",
        icon: <MessageSquare size={20} className="text-green-500" />,
        postCount: 16
      },
      {
        id: "study-groups",
        name: "Study Groups",
        description: "Find and join study groups",
        icon: <Users size={20} className="text-purple-500" />,
        postCount: 8
      }
    ];

    // Sample posts
    const samplePosts: ForumPost[] = [
      {
        id: "1",
        title: "Tips for memorizing cell structures?",
        content: "I'm struggling to remember all the organelles and their functions. Any advice?",
        author: "Emily Chen",
        authorEmail: "emily.chen@example.com",
        timestamp: new Date(Date.now() - 3600000 * 2), // 2 hours ago
        likes: 12,
        replies: 5,
        tags: ["biology", "study-tips", "memorization"]
      },
      {
        id: "2",
        title: "Looking for study partners for Organic Chemistry",
        content: "Anyone interested in forming a study group for Organic Chemistry? We can meet twice a week online.",
        author: "Marcus Johnson",
        authorEmail: "marcus.j@example.com",
        timestamp: new Date(Date.now() - 3600000 * 24), // 1 day ago
        likes: 8,
        replies: 10,
        tags: ["chemistry", "study-group", "organic-chemistry"]
      },
      {
        id: "3",
        title: "Resources for Genetics exam preparation",
        content: "Can anyone recommend good resources for preparing for a genetics exam? Looking for practice questions and study guides.",
        author: "Alex Johnson",
        authorEmail: "alex.johnson@example.com",
        timestamp: new Date(Date.now() - 3600000 * 48), // 2 days ago
        likes: 15,
        replies: 7,
        tags: ["genetics", "resources", "exam-prep"]
      },
      {
        id: "4",
        title: "How do you approach problem-based questions?",
        content: "I always struggle with problem-based questions in exams. What strategies do you use to break them down?",
        author: "Taylor Smith",
        authorEmail: "taylor.s@example.com",
        timestamp: new Date(Date.now() - 3600000 * 72), // 3 days ago
        likes: 20,
        replies: 12,
        tags: ["exam-strategies", "problem-solving", "study-tips"]
      }
    ];

    setCategories(sampleCategories);
    setPosts(samplePosts);
    setFilteredPosts(samplePosts);
  }, []);

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = [...posts];
    
    if (selectedCategory) {
      filtered = filtered.filter(post => 
        post.tags.includes(selectedCategory)
      );
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        post => 
          post.title.toLowerCase().includes(query) || 
          post.content.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchQuery]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)} hour${Math.floor(diffHours) === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.floor(diffHours / 24);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(prev => prev === categoryId ? null : categoryId);
  };

  const handleAddTag = () => {
    if (newPost.tagInput.trim() && !newPost.tags.includes(newPost.tagInput.trim())) {
      setNewPost({
        ...newPost,
        tags: [...newPost.tags, newPost.tagInput.trim()],
        tagInput: ""
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setNewPost({
      ...newPost,
      tags: newPost.tags.filter(t => t !== tag)
    });
  };

  const handleSubmitPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast.error("Please fill in both title and content");
      return;
    }

    const newForumPost: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: "Alex Johnson", // Using logged-in user info
      authorEmail: "alex.johnson@example.com",
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      tags: newPost.tags.length > 0 ? newPost.tags : ["general"]
    };

    setPosts([newForumPost, ...posts]);
    setNewPost({
      title: "",
      content: "",
      tags: [],
      tagInput: ""
    });
    setShowNewPostForm(false);
    toast.success("Post created successfully!");
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-24 px-4 pb-16 max-w-6xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Header Section */}
          <motion.div variants={item} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Discussion Forum
              </h1>
              <p className="text-gray-500 mt-1">
                Connect with other students, ask questions, and share resources
              </p>
            </div>
            <Button 
              variant="primary" 
              leftIcon={<Plus size={16} />} 
              onClick={() => setShowNewPostForm(true)}
            >
              New Discussion
            </Button>
          </motion.div>

          {/* Search and Filter */}
          <motion.div variants={item} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search size={16} />}
                showClearButton
                onClear={() => setSearchQuery("")}
              />
            </div>
            <div className="md:w-48">
              <div className="relative">
                <Button 
                  variant="outline" 
                  leftIcon={<Filter size={16} />}
                  fullWidth
                  className="justify-between"
                >
                  {selectedCategory ? 
                    categories.find(c => c.id === selectedCategory)?.name : 
                    "All Categories"}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* New Post Form */}
          {showNewPostForm && (
            <motion.div 
              variants={item} 
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <h2 className="text-lg font-semibold mb-4">Create New Discussion</h2>
              <div className="space-y-4">
                <Input
                  label="Title"
                  placeholder="Enter a clear, specific title for your discussion"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                />
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <textarea 
                    className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm transition-colors focus:border-brainbridge-blue focus:outline-none focus:ring-1 focus:ring-brainbridge-blue min-h-[120px]"
                    placeholder="Describe your question or discussion topic in detail"
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newPost.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        {tag}
                        <button 
                          type="button" 
                          className="ml-1 text-blue-500 hover:text-blue-700"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag (e.g., biology, study-tips)"
                      value={newPost.tagInput}
                      onChange={(e) => setNewPost({...newPost, tagInput: e.target.value})}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button onClick={handleAddTag} variant="outline">Add</Button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowNewPostForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleSubmitPost}
                  >
                    Post Discussion
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            {/* Categories Sidebar */}
            <motion.div variants={item} className="w-full md:w-64 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    className={`p-3 border-b last:border-0 cursor-pointer transition-colors ${
                      selectedCategory === category.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {category.icon}
                        <span className="font-medium text-gray-800">{category.name}</span>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {category.postCount}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Posts List */}
            <motion.div variants={item} className="flex-1 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">Discussions</h2>
              
              {filteredPosts.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                  <MessageCircle size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No discussions found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {searchQuery || selectedCategory ? 
                      "Try adjusting your search or filters" : 
                      "Be the first to start a discussion!"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-medium text-gray-800">{post.title}</h3>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock size={12} className="mr-1" />
                          {formatTime(post.timestamp)}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">{post.content}</p>
                      
                      <div className="flex flex-wrap mt-2 gap-1">
                        {post.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(tag);
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center text-sm">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${post.author.replace(' ', '+')}&background=random`} 
                            alt={post.author} 
                            className="w-6 h-6 rounded-full mr-2" 
                          />
                          <span className="font-medium text-gray-700">{post.author}</span>
                        </div>
                        
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <div className="flex items-center">
                            <ThumbsUp size={14} className="mr-1" />
                            {post.likes}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare size={14} className="mr-1" />
                            {post.replies}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Forum;
