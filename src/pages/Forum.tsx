
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Button from "@/components/Button";
import { 
  ArrowLeft, 
  MessageSquare, 
  Users, 
  ThumbsUp, 
  MessageCircle, 
  Share2, 
  Clock, 
  User,
  Search,
  SlidersHorizontal,
  BookOpen
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ForumPost {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  title: string;
  content: string;
  likes: number;
  comments: number;
  category: string;
  tags: string[];
  createdAt: string;
}

interface GroupDiscussion {
  id: string;
  title: string;
  description: string;
  members: number;
  lastActive: string;
  category: string;
  image?: string;
}

const Forum = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [groups, setGroups] = useState<GroupDiscussion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  // Sample categories for filtering
  const categories = ["All", "Biology", "Anatomy", "Genetics", "Chemistry", "Physics"];
  
  useEffect(() => {
    // Simulate fetching posts from an API
    const samplePosts: ForumPost[] = [
      {
        id: "post1",
        author: {
          name: "Jennifer K.",
          avatar: "/placeholder.svg"
        },
        title: "Can someone explain cellular respiration in simple terms?",
        content: "I'm struggling to understand the electron transport chain in cellular respiration. Could someone break it down in simpler terms?",
        likes: 24,
        comments: 8,
        category: "Biology",
        tags: ["cellular-respiration", "help-needed"],
        createdAt: "2023-05-15T14:30:00Z"
      },
      {
        id: "post2",
        author: {
          name: "Michael T.",
          avatar: "/placeholder.svg"
        },
        title: "DNA Replication Study Group - Weekly Notes",
        content: "Hey everyone! I'm sharing my notes from our DNA replication study group this week. We covered the enzymes involved and common replication errors.",
        likes: 47,
        comments: 15,
        category: "Genetics",
        tags: ["dna", "study-notes", "replication"],
        createdAt: "2023-05-14T09:15:00Z"
      },
      {
        id: "post3",
        author: {
          name: "Sarah L.",
          avatar: "/placeholder.svg"
        },
        title: "Best resources for learning about the endocrine system?",
        content: "I'm preparing for my final exam and need good resources for the endocrine system. Any recommendations for videos or books?",
        likes: 18,
        comments: 22,
        category: "Anatomy",
        tags: ["endocrine-system", "resources", "study-help"],
        createdAt: "2023-05-13T18:45:00Z"
      }
    ];
    
    // Sample group discussions
    const sampleGroups: GroupDiscussion[] = [
      {
        id: "group1",
        title: "Genetics Advanced Study Group",
        description: "A group dedicated to discussing advanced topics in genetics and genomics. Weekly discussions and problem-solving sessions.",
        members: 128,
        lastActive: "2023-05-15T14:30:00Z",
        category: "Genetics",
        image: "/lovable-uploads/0601505d-a965-4fca-96c3-949a4dfc18ca.png"
      },
      {
        id: "group2",
        title: "Anatomy & Physiology Support",
        description: "Helping each other understand complex anatomical structures and physiological processes. Perfect for beginners!",
        members: 245,
        lastActive: "2023-05-14T09:15:00Z",
        category: "Anatomy"
      },
      {
        id: "group3",
        title: "Biochemistry Mastery Circle",
        description: "Deep dive into biochemical pathways, enzymes, and molecular interactions. For intermediate to advanced students.",
        members: 97,
        lastActive: "2023-05-13T18:45:00Z",
        category: "Biology"
      },
      {
        id: "group4",
        title: "Pre-Med Study Partners",
        description: "A community of pre-med students helping each other prepare for exams and applications. Weekly study sessions and resources sharing.",
        members: 312,
        lastActive: "2023-05-12T11:20:00Z",
        category: "Biology"
      },
      {
        id: "group5",
        title: "Molecular Biology Research Discussion",
        description: "Discussing latest research papers and breakthroughs in molecular biology. Join if you're interested in cutting-edge science!",
        members: 76,
        lastActive: "2023-05-11T15:30:00Z",
        category: "Biology"
      }
    ];
    
    setPosts(samplePosts);
    setGroups(sampleGroups);
  }, []);
  
  // Filter posts by search query and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Filter groups by search query and category
  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-10 px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-3" 
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-800">Community Forum</h1>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search discussions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-brainbridge-blue"
            />
          </div>
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "outline"}
                size="sm"
                className="mr-2 whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="groups" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="groups" className="flex items-center gap-2">
              <Users size={16} />
              <span>Study Groups</span>
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Forum Discussions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="groups" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Study Groups</h2>
              <Button size="sm" variant="outline" leftIcon={<SlidersHorizontal size={16} />}>
                Filter
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGroups.map(group => (
                <motion.div
                  key={group.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-brainbridge-blue flex items-center justify-center relative">
                    {group.image ? (
                      <img 
                        src={group.image} 
                        alt={group.title} 
                        className="w-full h-full object-cover opacity-30"
                      />
                    ) : (
                      <BookOpen size={40} className="text-white opacity-50" />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{group.title}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {group.description}
                    </p>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <Users size={14} className="mr-1" />
                        <span>{group.members} members</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>Last active {formatDate(group.lastActive)}</span>
                      </div>
                    </div>
                    
                    <Button className="w-full mt-3">
                      Join Group
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredGroups.length === 0 && (
              <div className="text-center py-10">
                <Users size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-700">No groups found</h3>
                <p className="text-gray-500">Try changing your search or filter criteria</p>
              </div>
            )}
            
            <div className="flex justify-center mt-4">
              <Button variant="outline" leftIcon={<Users size={16} />}>
                Create New Group
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Latest Discussions</h2>
              <Button size="sm" variant="outline" leftIcon={<MessageSquare size={16} />}>
                New Post
              </Button>
            </div>
            
            <div className="space-y-4">
              {filteredPosts.map(post => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
                >
                  <div className="flex items-center mb-3">
                    <Avatar className="h-10 w-10 mr-3">
                      <img src={post.author.avatar} alt={post.author.name} />
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-gray-800">{post.author.name}</h3>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock size={12} className="mr-1" />
                        <span>{formatDate(post.createdAt)}</span>
                        <span className="mx-1">•</span>
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <h2 className="text-lg font-medium text-gray-800 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-3">{post.content}</p>
                  
                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center text-gray-500 hover:text-blue-600">
                        <ThumbsUp size={16} className="mr-1" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-blue-600">
                        <MessageCircle size={16} className="mr-1" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                    <button className="text-gray-500 hover:text-blue-600">
                      <Share2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-10">
                <MessageSquare size={40} className="mx-auto text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-700">No discussions found</h3>
                <p className="text-gray-500">Try changing your search or filter criteria</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Forum;
