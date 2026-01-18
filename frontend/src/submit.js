// submit.js

import { useState } from 'react';
import { useStore } from './store';
import { Button } from './components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';
import { Loader2, Play, Check, AlertCircle, Network, GitBranch, CheckCircle } from 'lucide-react';

export const SubmitButton = () => {
  const { nodes, edges } = useStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://vectorshift-pipeline-api-1066352068133.asia-south1.run.app';
      const response = await fetch(`${API_URL}/pipelines/parse`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodes: nodes.map((node) => ({
            id: node.id,
            type: node.type,
            data: node.data,
          })),
          edges: edges.map((edge) => ({
            source: edge.source,
            target: edge.target,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse pipeline');
      }

      const data = await response.json();
      setResult(data);
      setDialogOpen(true);
    } catch (err) {
      setError(err.message);
      setDialogOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleSubmit}
        disabled={loading || nodes.length === 0}
        className="h-8 px-4 bg-primary hover:bg-primary/90 text-white font-medium text-sm rounded-md shadow-none"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Play className="w-4 h-4 mr-2" fill="currentColor" />
            Submit
          </>
        )}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-slate-100">
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              {error ? (
                <>
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Error
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Pipeline Analysis Complete
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          <div className="px-5 py-4">
            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : result && (
              <div className="space-y-3">
                <p className="text-sm text-slate-500">Your pipeline has been validated successfully.</p>
                
                <div className="grid grid-cols-3 gap-3">
                  {/* Nodes */}
                  <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Network className="w-5 h-5 text-blue-500 mb-1" />
                    <span className="text-2xl font-bold text-blue-600">{result.num_nodes}</span>
                    <span className="text-xs text-blue-500 font-medium">Nodes</span>
                  </div>
                  
                  {/* Edges */}
                  <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <GitBranch className="w-5 h-5 text-purple-500 mb-1" />
                    <span className="text-2xl font-bold text-purple-600">{result.num_edges}</span>
                    <span className="text-xs text-purple-500 font-medium">Edges</span>
                  </div>
                  
                  {/* DAG Status */}
                  <div className={`flex flex-col items-center p-3 rounded-lg border ${
                    result.is_dag 
                      ? 'bg-emerald-50 border-emerald-100' 
                      : 'bg-red-50 border-red-100'
                  }`}>
                    <Check className={`w-5 h-5 mb-1 ${
                      result.is_dag ? 'text-emerald-500' : 'text-red-500'
                    }`} />
                    <span className={`text-lg font-bold ${
                      result.is_dag ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {result.is_dag ? 'Yes' : 'No'}
                    </span>
                    <span className={`text-xs font-medium ${
                      result.is_dag ? 'text-emerald-500' : 'text-red-500'
                    }`}>Valid DAG</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
            <Button
              onClick={() => setDialogOpen(false)}
              className="h-8 px-4 bg-primary hover:bg-primary/90 text-white font-medium text-sm"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
