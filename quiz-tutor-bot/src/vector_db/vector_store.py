"""
Vector database implementation using ChromaDB for donor email storage and semantic search.
"""
import os
import uuid
from typing import List, Dict, Any, Optional
import chromadb
from chromadb.config import Settings
from chromadb.utils import embedding_functions
from datetime import datetime


class VectorStore:
    """
    ChromaDB-based vector store for donor emails and knowledge base.
    Supports semantic search and context retrieval for quiz generation.
    """

    def __init__(
        self,
        persist_directory: str = "./data/chromadb",
        collection_name: str = "donor_emails"
    ):
        """
        Initialize the vector store.

        Args:
            persist_directory: Directory to persist the database
            collection_name: Name of the collection
        """
        self.persist_directory = persist_directory
        self.collection_name = collection_name

        # Ensure directory exists
        os.makedirs(persist_directory, exist_ok=True)

        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(
                anonymized_telemetry=False,
                allow_reset=True
            )
        )

        # Use sentence transformer for embeddings
        self.embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )

        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            embedding_function=self.embedding_function,
            metadata={"description": "Donor emails and non-profit communications"}
        )

    def add_donor_email(
        self,
        sender: str,
        subject: str,
        content: str,
        date: datetime,
        category: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Add a donor email to the vector store.

        Args:
            sender: Email sender
            subject: Email subject
            content: Email content
            date: Email date
            category: Optional category
            metadata: Additional metadata

        Returns:
            Document ID
        """
        doc_id = str(uuid.uuid4())

        # Combine subject and content for better context
        document_text = f"Subject: {subject}\n\nContent: {content}"

        # Prepare metadata
        doc_metadata = {
            "sender": sender,
            "subject": subject,
            "date": date.isoformat(),
            "category": category or "general",
            **(metadata or {})
        }

        # Add to collection
        self.collection.add(
            documents=[document_text],
            metadatas=[doc_metadata],
            ids=[doc_id]
        )

        return doc_id

    def search_similar(
        self,
        query: str,
        n_results: int = 5,
        filter_metadata: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """
        Search for similar donor emails using semantic search.

        Args:
            query: Search query
            n_results: Number of results to return
            filter_metadata: Optional metadata filter

        Returns:
            List of matching documents with metadata
        """
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results,
            where=filter_metadata
        )

        # Format results
        formatted_results = []
        if results['documents'] and results['documents'][0]:
            for i in range(len(results['documents'][0])):
                formatted_results.append({
                    "id": results['ids'][0][i],
                    "content": results['documents'][0][i],
                    "metadata": results['metadatas'][0][i],
                    "distance": results['distances'][0][i] if 'distances' in results else None
                })

        return formatted_results

    def get_by_topic(
        self,
        topic: str,
        n_results: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get emails related to a specific topic.

        Args:
            topic: Topic to search for
            n_results: Number of results

        Returns:
            List of relevant emails
        """
        return self.search_similar(topic, n_results)

    def get_by_category(
        self,
        category: str,
        n_results: int = 10
    ) -> List[Dict[str, Any]]:
        """
        Get emails by category.

        Args:
            category: Category to filter by
            n_results: Number of results

        Returns:
            List of emails in category
        """
        results = self.collection.get(
            where={"category": category},
            limit=n_results
        )

        formatted_results = []
        if results['documents']:
            for i in range(len(results['documents'])):
                formatted_results.append({
                    "id": results['ids'][i],
                    "content": results['documents'][i],
                    "metadata": results['metadatas'][i]
                })

        return formatted_results

    def get_all_categories(self) -> List[str]:
        """
        Get all unique categories in the database.

        Returns:
            List of category names
        """
        all_docs = self.collection.get()
        categories = set()

        if all_docs['metadatas']:
            for metadata in all_docs['metadatas']:
                if 'category' in metadata:
                    categories.add(metadata['category'])

        return sorted(list(categories))

    def get_random_samples(
        self,
        n_samples: int = 5,
        category: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Get random samples from the database.

        Args:
            n_samples: Number of samples
            category: Optional category filter

        Returns:
            List of random documents
        """
        import random

        if category:
            all_docs = self.collection.get(where={"category": category})
        else:
            all_docs = self.collection.get()

        if not all_docs['documents']:
            return []

        # Get random indices
        total_docs = len(all_docs['documents'])
        sample_size = min(n_samples, total_docs)
        indices = random.sample(range(total_docs), sample_size)

        # Format results
        samples = []
        for i in indices:
            samples.append({
                "id": all_docs['ids'][i],
                "content": all_docs['documents'][i],
                "metadata": all_docs['metadatas'][i]
            })

        return samples

    def get_context_for_question(
        self,
        question_text: str,
        topic: str
    ) -> str:
        """
        Get relevant context from donor emails for a question.

        Args:
            question_text: The question text
            topic: The question topic

        Returns:
            Relevant context string
        """
        # Search for relevant emails
        results = self.search_similar(
            query=f"{topic}: {question_text}",
            n_results=2
        )

        if not results:
            return ""

        # Combine top results
        context_parts = []
        for result in results:
            content = result['content']
            # Limit context length
            if len(content) > 500:
                content = content[:500] + "..."
            context_parts.append(content)

        return "\n\n---\n\n".join(context_parts)

    def count_documents(self) -> int:
        """Get total number of documents in the collection"""
        return self.collection.count()

    def delete_document(self, doc_id: str) -> bool:
        """
        Delete a document by ID.

        Args:
            doc_id: Document ID to delete

        Returns:
            Success status
        """
        try:
            self.collection.delete(ids=[doc_id])
            return True
        except Exception:
            return False

    def reset_collection(self) -> bool:
        """
        Reset the entire collection (use with caution).

        Returns:
            Success status
        """
        try:
            self.client.delete_collection(name=self.collection_name)
            self.collection = self.client.create_collection(
                name=self.collection_name,
                embedding_function=self.embedding_function
            )
            return True
        except Exception:
            return False
