import { useState } from 'react';
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { TooltipProvider } from './components/ui/tooltip';
import { useStore } from './store';
import { Workflow, Trash2, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';
import { Button } from './components/ui/button';

function App() {
  const { nodes, clearAll } = useStore();
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleClearAll = () => {
    if (nodes.length === 0) return;
    setShowClearDialog(true);
  };

  const confirmClear = () => {
    clearAll();
    setShowClearDialog(false);
  };

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-slate-50">
        {/* Header */}
        <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 bg-white border-b border-slate-200">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Workflow className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-800">Workflow Builder</span>
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500">VectorShift Assessment</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {nodes.length > 0 && (
              <button
                onClick={handleClearAll}
                className="h-8 px-3 flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
            <SubmitButton />
          </div>
        </header>

        {/* Toolbar */}
        <PipelineToolbar />

        {/* Main canvas area */}
        <main className="flex-1 overflow-hidden">
          <PipelineUI />
        </main>

        {/* Clear All Confirmation Dialog */}
        <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <DialogTitle>Clear All Nodes?</DialogTitle>
                  <DialogDescription className="mt-1">
                    This will remove all {nodes.length} node{nodes.length !== 1 ? 's' : ''} and their connections from the canvas.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowClearDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmClear}
                className="bg-red-600 hover:bg-red-700"
              >
                Clear All
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}

export default App;
