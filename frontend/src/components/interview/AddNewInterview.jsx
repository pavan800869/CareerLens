import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import axios from 'axios';
import { INTERVIEW_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const AddNewInterview = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobExperience, setJobExperience] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${INTERVIEW_API_END_POINT}/create`, {
        jobPosition,
        jobDesc,
        jobExperience
      }, {
        withCredentials: true
      });

      if (res.data.success) {
        setOpen(false);
        navigate(`/ai-mock-interview/${res.data.interview.mockId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to generate interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div 
        onClick={() => setOpen(true)}
        className="glass-card p-10 flex flex-col items-center justify-center cursor-pointer card-hover border-dashed border-2 border-slate-700/50 hover:border-neon-purple/50 group"
      >
        <div className="w-12 h-12 rounded-full bg-neon-purple/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
          <Plus className="w-6 h-6 text-neon-purple" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Create New Interview</h2>
        <p className="text-sm text-muted-foreground mt-1">AI will generate custom questions</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass border border-border text-foreground max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Tell us about the role</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Provide details about the position to generate highly relevant interview questions.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Job Role / Position</label>
                <Input
                  className="bg-accent border-border text-foreground input-glow"
                  placeholder="e.g. Full Stack Developer, Product Manager"
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Tech Stack / Description</label>
                <textarea
                  className="w-full bg-accent border border-border rounded-md p-3 text-foreground input-glow min-h-[100px] text-sm"
                  placeholder="e.g. React, Node.js, System Design, Agile"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Years of Experience</label>
                <Input
                  type="number"
                  min="0"
                  max="50"
                  className="bg-accent border-border text-foreground input-glow"
                  placeholder="e.g. 3"
                  value={jobExperience}
                  onChange={(e) => setJobExperience(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground hover:bg-accent">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="gradient-btn border-0">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  "Start Setup"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
