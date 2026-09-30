from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class RelationItem(BaseModel):
    subject: str = Field(..., description="L'entité source de la relation (ex: Alice Martin)")
    relation: str = Field(..., description="Le prédicat reliant le sujet à l'objet (ex: educated_at)")
    object: str = Field(..., description="L'entité cible de la relation (ex: Stanford University)")

class ExtractionRequest(BaseModel):
    text: str = Field(..., description="Le texte brut à analyser")
    strategy: str = Field(default="zeroshot_structured", description="Stratégie : zeroshot_simple, zeroshot_structured, fewshot, cot")
    temperature: float = Field(default=0.0, ge=0.0, le=1.0, description="Température de génération (0.0 à 1.0)")
    top_k: Optional[int] = Field(default=40, description="Contrôle top_k pour le sampling")
    top_p: Optional[float] = Field(default=0.9, description="Contrôle top_p (nucleus sampling)")
    num_predict: Optional[int] = Field(default=512, description="Nombre maximal de tokens générés")
    force_json: Optional[bool] = Field(default=True, description="Active la grammaire stricte Ollama (True pour l'UI, False pour benchmark)")

class ExtractionResponse(BaseModel):
    success: bool
    strategy_used: str
    temperature_used: float
    relations: List[RelationItem] = []
    yaml_output: str = ""
    raw_response: str = ""
    json_valid: bool = False
    metrics: Dict[str, Any] = {}
    error_message: Optional[str] = None