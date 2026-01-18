from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from collections import defaultdict, deque

app = FastAPI(title="Pipeline Parser API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for request/response
class Node(BaseModel):
    id: str
    type: str
    data: Dict[str, Any] = {}


class Edge(BaseModel):
    source: str
    target: str


class PipelineRequest(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


def is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    """
    Check if the graph is a Directed Acyclic Graph (DAG) using Kahn's algorithm.
    
    Kahn's algorithm works by:
    1. Computing in-degree (number of incoming edges) for each node
    2. Starting with nodes that have in-degree 0 (no dependencies)
    3. Removing those nodes and decreasing in-degree of their neighbors
    4. If all nodes can be processed, it's a DAG; otherwise, there's a cycle
    
    Returns True if the graph is a DAG, False otherwise.
    """
    if not nodes:
        return True  # Empty graph is a DAG
    
    # Build adjacency list and in-degree count
    adj = defaultdict(list)
    in_degree = defaultdict(int)
    node_ids = {n.id for n in nodes}
    
    # Initialize in-degree for all nodes
    for node_id in node_ids:
        in_degree[node_id] = 0
    
    # Build the graph from edges
    for edge in edges:
        # Only consider edges where both source and target exist in nodes
        if edge.source in node_ids and edge.target in node_ids:
            adj[edge.source].append(edge.target)
            in_degree[edge.target] += 1
    
    # Find all nodes with no incoming edges (in-degree = 0)
    queue = deque([node_id for node_id in node_ids if in_degree[node_id] == 0])
    visited_count = 0
    
    # Process nodes in topological order
    while queue:
        node = queue.popleft()
        visited_count += 1
        
        # Decrease in-degree for all neighbors
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            # If neighbor has no more incoming edges, add to queue
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we visited all nodes, the graph is a DAG
    return visited_count == len(node_ids)


@app.get('/')
def read_root():
    """Health check endpoint."""
    return {'status': 'ok', 'message': 'Pipeline Parser API is running'}


@app.post('/pipelines/parse', response_model=PipelineResponse)
async def parse_pipeline(pipeline: PipelineRequest):
    """
    Parse a pipeline and return analysis results.
    
    Calculates:
    - num_nodes: Total number of nodes in the pipeline
    - num_edges: Total number of edges (connections) in the pipeline
    - is_dag: Whether the pipeline forms a valid Directed Acyclic Graph
    """
    num_nodes = len(pipeline.nodes)
    num_edges = len(pipeline.edges)
    dag_result = is_dag(pipeline.nodes, pipeline.edges)
    
    return PipelineResponse(
        num_nodes=num_nodes,
        num_edges=num_edges,
        is_dag=dag_result
    )
