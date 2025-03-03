
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  BookOpen,
  Plus,
  X
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
  joined?: boolean;
}

const Forum = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [groups, setGroups] = useState<GroupDiscussion[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const [newGroupData, setNewGroupData] = useState({
    title: "",
    description: "",
    category: "NEET"
  });
  const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
  const [newPostData, setNewPostData] = useState({
    title: "",
    content: "",
    category: "NEET",
    tags: ""
  });
  
  // Sample categories for filtering
  const categories = ["All", "NEET", "JEE", "GRE", "GATE", "TOEFL"];
  
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
        category: "NEET",
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
        category: "NEET",
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
        category: "NEET",
        tags: ["endocrine-system", "resources", "study-help"],
        createdAt: "2023-05-13T18:45:00Z"
      }
    ];
    
    // Sample group discussions
    const sampleGroups: GroupDiscussion[] = [
      {
        id: "group1",
        title: "NEET Advanced Study Group",
        description: "A group dedicated to discussing advanced topics in NEET preparation. Weekly discussions and problem-solving sessions.",
        members: 128,
        lastActive: "2023-05-15T14:30:00Z",
        category: "NEET",
        image: "/lovable-uploads/0601505d-a965-4fca-96c3-949a4dfc18ca.png"
      },
      {
        id: "group2",
        title: "Anatomy & Physiology Support",
        description: "Helping each other understand complex anatomical structures and physiological processes. Perfect for beginners!",
        members: 245,
        lastActive: "2023-05-14T09:15:00Z",
        category: "NEET"
      },
      {
        id: "group3",
        title: "Biochemistry Mastery Circle",
        description: "Deep dive into biochemical pathways, enzymes, and molecular interactions. For intermediate to advanced students.",
        members: 97,
        lastActive: "2023-05-13T18:45:00Z",
        category: "NEET"
      },
      {
        id: "group4",
        title: "Pre-Med Study Partners",
        description: "A community of pre-med students helping each other prepare for exams and applications. Weekly study sessions and resources sharing.",
        members: 312,
        lastActive: "2023-05-12T11:20:00Z",
        category: "NEET"
      },
      {
        id: "group5",
        title: "Molecular Biology Research Discussion",
        description: "Discussing latest research papers and breakthroughs in molecular biology. Join if you're interested in cutting-edge science!",
        members: 76,
        lastActive: "2023-05-11T15:30:00Z",
        category: "NEET"
      },
      {
        id: "group6",
        title: "JEE Mathematics Champions",
        description: "Master complex mathematical problems for JEE exams. Daily practice problems and solution discussions.",
        members: 185,
        lastActive: "2023-05-10T13:45:00Z",
        category: "JEE"
      },
      {
        id: "group7",
        title: "GRE Vocabulary Group",
        description: "Build your GRE vocabulary together. Daily word lists, mnemonics, and practice exercises.",
        members: 142,
        lastActive: "2023-05-09T16:20:00Z",
        category: "GRE"
      },
      {
        id: "group8",
        title: "GATE Computer Science Preparation",
        description: "Preparing for GATE CS? Join this group for structured study plans, previous year questions, and mock tests.",
        members: 95,
        lastActive: "2023-05-08T10:15:00Z",
        category: "GATE"
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

  const handleJoinGroup = (groupId: string) => {
    setGroups(prev => 
      prev.map(group => 
        group.id === groupId ? { ...group, joined: !group.joined } : group
      )
    );
    
    const group = groups.find(g => g.id === groupId);
    if (group) {
      if (group.joined) {
        toast.info(`Left the ${group.title} group`);
      } else {
        toast.success(`Joined the ${group.title} group!`);
      }
    }
  };
  
  const handleCreateGroup = () => {
    if (!newGroupData.title.trim() || !newGroupData.description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newGroup: GroupDiscussion = {
      id: `group${groups.length + 1}`,
      title: newGroupData.title,
      description: newGroupData.description,
      members: 1,
      lastActive: new Date().toISOString(),
      category: newGroupData.category,
      joined: true
    };
    
    setGroups(prev => [newGroup, ...prev]);
    setIsCreateGroupDialogOpen(false);
    setNewGroupData({
      title: "",
      description: "",
      category: "NEET"
    });
    
    toast.success("Group created successfully!");
  };
  
  const handleCreatePost = () => {
    if (!newPostData.title.trim() || !newPostData.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    const newPost: ForumPost = {
      id: `post${posts.length + 1}`,
      author: {
        name: "Haripriya",
        avatar: "/placeholder.svg"
      },
      title: newPostData.title,
      content: newPostData.content,
      likes: 0,
      comments: 0,
      category: newPostData.category,
      tags: newPostData.tags.split(",").map(tag => tag.trim().toLowerCase().replace(/\s+/g, "-")),
      createdAt: new Date().toISOString()
    };
    
    setPosts(prev => [newPost, ...prev]);
    setIsCreatePostDialogOpen(false);
    setNewPostData({
      title: "",
      content: "",
      category: "NEET",
      tags: ""
    });
    
    toast.success("Post created successfully!");
  };
  
  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm h-16">
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="icon" 
              leftIcon={<ArrowLeft size={20} />}
              onClick={() => navigate("/dashboard")}
              className="mr-4"
              aria-label="Back to Dashboard"
            />
          </div>
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800">Community Forum</h1>
          </div>
          <div className="w-[100px]"></div> {/* Empty div to balance the header */}
        </div>
      </header>
      
      <div className="pt-20 pb-10 px-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              type="text" 
              placeholder="Search discussions..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-gray-200 focus:border-brainbridge-purple"
            />
          </div>
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "primary" : "outline"}
                size="sm"
                className={`mr-2 whitespace-nowrap ${selectedCategory === category ? 'bg-brainbridge-purple hover:bg-brainbridge-lightpurple' : 'border-brainbridge-purple text-brainbridge-purple'}`}
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
                  <div className="h-24 bg-gradient-to-r from-purple-500 to-brainbridge-purple flex items-center justify-center relative">
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
                    
                    <Button 
                      className={`w-full mt-3 ${group.joined ? 'bg-purple-200 text-purple-800 hover:bg-purple-300' : 'bg-brainbridge-purple hover:bg-brainbridge-lightpurple'}`}
                      onClick={() => handleJoinGroup(group.id)}
                    >
                      {group.joined ? 'Leave Group' : 'Join Group'}
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
              <Button 
                variant="primary" 
                leftIcon={<Plus size={16} />}
                className="bg-brainbridge-purple hover:bg-brainbridge-lightpurple"
                onClick={() => setIsCreateGroupDialogOpen(true)}
              >
                Create New Group
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Latest Discussions</h2>
              <Button 
                size="sm" 
                variant="primary" 
                leftIcon={<MessageSquare size={16} />}
                className="bg-brainbridge-purple hover:bg-brainbridge-lightpurple"
                onClick={() => setIsCreatePostDialogOpen(true)}
              >
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
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
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
                      <button className="flex items-center text-gray-500 hover:text-purple-600">
                        <ThumbsUp size={16} className="mr-1" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center text-gray-500 hover:text-purple-600">
                        <MessageCircle size={16} className="mr-1" />
                        <span>{post.comments}</span>
                      </button>
                    </div>
                    <button className="text-gray-500 hover:text-purple-600">
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

      {/* Create Group Dialog */}
      <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create a New Study Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="group-title">Group Title</Label>
              <Input 
                id="group-title" 
                placeholder="Enter group title..." 
                value={newGroupData.title} 
                onChange={(e) => setNewGroupData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-description">Description</Label>
              <Textarea 
                id="group-description" 
                placeholder="Describe what your group is about..."
                rows={3}
                value={newGroupData.description}
                onChange={(e) => setNewGroupData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="group-category">Category</Label>
              <select 
                id="group-category"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newGroupData.category}
                onChange={(e) => setNewGroupData(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.filter(c => c !== "All").map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateGroupDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={handleCreateGroup}
              className="bg-brainbridge-purple hover:bg-brainbridge-lightpurple"
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Post Dialog */}
      <Dialog open={isCreatePostDialogOpen} onOpenChange={setIsCreatePostDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create a New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">Post Title</Label>
              <Input 
                id="post-title" 
                placeholder="Enter post title..." 
                value={newPostData.title} 
                onChange={(e) => setNewPostData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea 
                id="post-content" 
                placeholder="Write your post here..."
                rows={5}
                value={newPostData.content}
                onChange={(e) => setNewPostData(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-category">Category</Label>
              <select 
                id="post-category"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={newPostData.category}
                onChange={(e) => setNewPostData(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.filter(c => c !== "All").map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="post-tags">Tags (comma-separated)</Label>
              <Input 
                id="post-tags" 
                placeholder="e.g. chemistry, organic-chemistry, reactions" 
                value={newPostData.tags} 
                onChange={(e) => setNewPostData(prev => ({ ...prev, tags: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreatePostDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              onClick={handleCreatePost}
              className="bg-brainbridge-purple hover:bg-brainbridge-lightpurple"
            >
              Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Forum;
