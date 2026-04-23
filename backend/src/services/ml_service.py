"""
ML Service
Handles XGBoost model training, prediction, and SHAP explanations
"""

from typing import Dict, Any, List, Optional
import logging
import os
import random

logger = logging.getLogger(__name__)

class MLService:
    def __init__(self, model_path: str = "models/xgboost_model.pkl"):
        self.model_path = model_path
        self.model = None
        self.feature_names = None
        self._load_model()
    
    def _load_model(self):
        """Load trained XGBoost model"""
        try:
            # For demo purposes, use mock model
            self._create_mock_model()
        except Exception as e:
            logger.error(f"Error loading model: {str(e)}")
            self._create_mock_model()
    
    def _create_mock_model(self):
        """Create mock model for demo purposes"""
        self.feature_names = [
            'funding_millions',
            'employees',
            'years_since_founded',
            'valuation_millions',
            'funding_per_employee',
            'growth_rate'
        ]
        logger.info("Using mock ML model for demo")
    
    def is_ready(self) -> bool:
        """Check if model is loaded"""
        return self.feature_names is not None
    
    def _calculate_risk_score(self, features: Dict[str, Any]) -> float:
        """
        Calculate risk score based on startup features
        Lower score = lower risk (better)
        """
        score = 50.0  # Base score
        
        # Funding analysis
        funding = features.get('funding_millions', 0)
        if funding < 5:
            score += 15
        elif funding < 20:
            score += 10
        elif funding > 100:
            score -= 10
        
        # Employee count
        employees = features.get('employees', 0)
        if employees < 10:
            score += 20
        elif employees < 50:
            score += 10
        elif employees > 500:
            score -= 10
        
        # Age of company
        years = features.get('years_since_founded', 0)
        if years < 1:
            score += 15
        elif years < 3:
            score += 10
        elif years > 7:
            score -= 10
        
        # Valuation
        valuation = features.get('valuation_millions', 0)
        if valuation > 1000:
            score -= 15
        elif valuation > 100:
            score -= 5
        
        # Funding efficiency
        if employees > 0 and funding > 0:
            funding_per_employee = funding / employees
            if funding_per_employee > 1:
                score -= 5
            elif funding_per_employee < 0.1:
                score += 10
        
        # Clamp score between 0 and 100
        return max(0, min(100, score))
    
    def _generate_shap_values(self, features: Dict[str, Any], risk_score: float) -> Dict[str, float]:
        """
        Generate mock SHAP values for feature importance
        In production, this would use actual SHAP library
        """
        base_value = 50.0
        shap_values = {}
        
        # Calculate contribution of each feature
        funding = features.get('funding_millions', 0)
        employees = features.get('employees', 0)
        years = features.get('years_since_founded', 0)
        valuation = features.get('valuation_millions', 0)
        
        # Funding impact
        if funding < 5:
            shap_values['funding_millions'] = 8.0
        elif funding < 20:
            shap_values['funding_millions'] = 4.0
        elif funding > 100:
            shap_values['funding_millions'] = -6.0
        else:
            shap_values['funding_millions'] = 0.0
        
        # Employee impact
        if employees < 10:
            shap_values['employees'] = 10.0
        elif employees < 50:
            shap_values['employees'] = 5.0
        elif employees > 500:
            shap_values['employees'] = -5.0
        else:
            shap_values['employees'] = 0.0
        
        # Age impact
        if years < 1:
            shap_values['years_since_founded'] = 7.0
        elif years < 3:
            shap_values['years_since_founded'] = 4.0
        elif years > 7:
            shap_values['years_since_founded'] = -4.0
        else:
            shap_values['years_since_founded'] = 0.0
        
        # Valuation impact
        if valuation > 1000:
            shap_values['valuation_millions'] = -8.0
        elif valuation > 100:
            shap_values['valuation_millions'] = -3.0
        else:
            shap_values['valuation_millions'] = 2.0
        
        # Funding efficiency
        if employees > 0 and funding > 0:
            funding_per_employee = funding / employees
            if funding_per_employee > 1:
                shap_values['funding_per_employee'] = -3.0
            elif funding_per_employee < 0.1:
                shap_values['funding_per_employee'] = 5.0
            else:
                shap_values['funding_per_employee'] = 0.0
        else:
            shap_values['funding_per_employee'] = 0.0
        
        # Growth rate (mock)
        shap_values['growth_rate'] = random.uniform(-2, 2)
        
        return shap_values
    
    def _get_risk_level(self, risk_score: float) -> str:
        """Categorize risk score into levels"""
        if risk_score < 35:
            return "low"
        elif risk_score < 65:
            return "medium"
        else:
            return "high"
    
    def _generate_recommendations(self, risk_score: float, features: Dict[str, Any]) -> List[str]:
        """Generate actionable recommendations based on risk analysis"""
        recommendations = []
        
        funding = features.get('funding_millions', 0)
        employees = features.get('employees', 0)
        years = features.get('years_since_founded', 0)
        
        if risk_score > 65:
            recommendations.append("⚠️ High risk detected - conduct thorough due diligence")
            
        if funding < 5:
            recommendations.append("💰 Limited funding - assess runway and burn rate carefully")
        
        if employees < 10:
            recommendations.append("👥 Small team - evaluate key person risk and scalability")
        
        if years < 2:
            recommendations.append("📅 Early stage - verify product-market fit and traction metrics")
        
        if employees > 0 and funding > 0:
            funding_per_employee = funding / employees
            if funding_per_employee < 0.1:
                recommendations.append("💸 Low capital efficiency - investigate burn rate and unit economics")
        
        if risk_score < 35:
            recommendations.append("✅ Strong fundamentals - consider for investment portfolio")
            recommendations.append("📊 Monitor growth metrics and competitive positioning")
        
        if not recommendations:
            recommendations.append("📈 Moderate risk profile - standard due diligence recommended")
        
        return recommendations
    
    def predict(self, startup_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Predict risk score for a startup
        Returns risk score, level, SHAP values, and recommendations
        """
        try:
            # Extract and prepare features
            features = {
                'funding_millions': startup_data.get('funding_millions', 0),
                'employees': startup_data.get('employees', 0),
                'years_since_founded': startup_data.get('years_since_founded', 0),
                'valuation_millions': startup_data.get('valuation_millions', 0),
                'funding_per_employee': 0,
                'growth_rate': startup_data.get('growth_rate', 0)
            }
            
            # Calculate derived features
            if features['employees'] > 0 and features['funding_millions'] > 0:
                features['funding_per_employee'] = features['funding_millions'] / features['employees']
            
            # Calculate risk score
            risk_score = self._calculate_risk_score(features)
            risk_level = self._get_risk_level(risk_score)
            
            # Generate SHAP values
            shap_values = self._generate_shap_values(features, risk_score)
            
            # Sort features by absolute SHAP value for importance
            feature_importance = sorted(
                [{"feature": k, "impact": v} for k, v in shap_values.items()],
                key=lambda x: abs(x["impact"]),
                reverse=True
            )
            
            # Generate recommendations
            recommendations = self._generate_recommendations(risk_score, features)
            
            # Calculate probability (inverse of risk for success probability)
            success_probability = (100 - risk_score) / 100
            
            return {
                "risk_score": round(risk_score, 2),
                "risk_level": risk_level,
                "probability": round(success_probability, 3),
                "shap_values": shap_values,
                "feature_importance": feature_importance,
                "recommendations": recommendations
            }
            
        except Exception as e:
            logger.error(f"Prediction error: {str(e)}")
            raise Exception(f"Failed to generate prediction: {str(e)}")
