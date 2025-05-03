from typing import Dict, List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies import get_db, verify_api_key
from app.models.code_analysis import CodeAnalysis, CodeAnalysisSchema
from app.services.code_analysis_service import CodeAnalysisService

router = APIRouter(prefix="/api/analyze", tags=["code-analysis"])

@router.post("", response_model=CodeAnalysisSchema)
async def analyze(
    request: Dict[str, str],
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
) -> CodeAnalysis:
    try:
        code = request["code"]
        service = CodeAnalysisService(db)
        return service.create_analysis(code)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code is required in the request body"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/{analysis_id}", response_model=CodeAnalysisSchema)
async def get_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
) -> CodeAnalysis:
    service = CodeAnalysisService(db)
    analysis = service.get_analysis_by_id(analysis_id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Analysis with ID {analysis_id} not found"
        )
    return analysis

@router.get("", response_model=List[CodeAnalysisSchema])
async def get_recent_analyses(
    limit: int = 10,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
) -> List[CodeAnalysis]:
    service = CodeAnalysisService(db)
    return service.get_recent_analyses(limit)

@router.delete("/{analysis_id}")
async def delete_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    api_key: str = Depends(verify_api_key)
) -> Dict[str, str]:
    service = CodeAnalysisService(db)
    if service.delete_analysis(analysis_id):
        return {"message": f"Analysis with ID {analysis_id} deleted successfully"}
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Analysis with ID {analysis_id} not found"
    )