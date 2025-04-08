import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { getAISystemPrompt } from "@/lib/utils";

interface AIPromptDialogProps {
  title: string;
  userPrompt: string;
  trigger?: React.ReactNode;
}

const AIPromptDialog: React.FC<AIPromptDialogProps> = ({ 
  title, 
  userPrompt,
  trigger
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="text-xs">
            View AI Prompt
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center justify-between">
            {title}
            <DialogClose className="h-6 w-6 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">System Prompt</h3>
            <div className="bg-slate-50 p-3 rounded-md border text-sm font-mono whitespace-pre-wrap">
              {getAISystemPrompt()}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">User Prompt</h3>
            <div className="bg-slate-50 p-3 rounded-md border text-sm font-mono whitespace-pre-wrap">
              {userPrompt}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">Model</h3>
            <div className="bg-slate-50 p-3 rounded-md border">
              <span className="text-sm font-medium">gpt-4o-mini</span>
              <p className="text-xs text-gray-500 mt-1">
                A compact and faster version of GPT-4o, optimized for efficiency while maintaining high-quality analysis capabilities.
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold mb-2">Parameters</h3>
            <div className="bg-slate-50 p-3 rounded-md border grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs font-medium">Temperature</span>
                <p className="text-xs text-gray-500">0.7</p>
              </div>
              <div>
                <span className="text-xs font-medium">Max Tokens</span>
                <p className="text-xs text-gray-500">150</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIPromptDialog;