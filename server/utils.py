def calculate_bmr(weight: float, height: float, age: int, gender: str) -> float:
    # Mifflin-St Jeor Equation
    if gender.lower() == "male":
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5
    else:
        # Female
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161
    return bmr

def calculate_daily_target(bmr: float, activity_level: str, goal: str) -> int:
    multipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very_active": 1.9
    }
    
    tdee = bmr * multipliers.get(activity_level.lower(), 1.2)
    
    goal_adjustment = 0
    if goal.lower() == "lose":
        goal_adjustment = -500
    elif goal.lower() == "gain":
        goal_adjustment = 500
        
    target = tdee + goal_adjustment
    return int(target)
