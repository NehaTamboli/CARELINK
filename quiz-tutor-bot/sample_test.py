"""
Sample test script for Non-Profit Quiz/Tutor Bot API.
Demonstrates the complete workflow: upload emails → generate quiz → answer questions.
"""
import requests
import json
import time
from datetime import datetime

# Configuration
API_BASE = "http://localhost:8000/api/v1"
USER_ID = f"student_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.END}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(60)}{Colors.END}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.END}\n")

def print_success(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.END}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.END}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.END}")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.END}")

def check_health():
    """Check if API is running"""
    print_header("Checking API Health")
    try:
        response = requests.get(f"{API_BASE}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_success(f"API is healthy: {data['service']}")
            print_info(f"Timestamp: {data['timestamp']}")
            return True
        else:
            print_error("API returned non-200 status")
            return False
    except requests.exceptions.ConnectionError:
        print_error("Cannot connect to API. Is the server running?")
        print_info("Start server with: python main.py")
        return False
    except Exception as e:
        print_error(f"Error: {str(e)}")
        return False

def upload_sample_emails():
    """Upload sample donor emails to build knowledge base"""
    print_header("Uploading Sample Donor Emails")

    sample_emails = [
        {
            "sender": "neha.tamboli@donors.in",
            "subject": "Volunteer Program - Skills Contribution",
            "content": """
            Dear Team,

            I'm Neha Tamboli, and I'm interested in volunteering for your literacy programs.
            I have 5 years of experience in education and would like to dedicate 10 hours
            per week to teaching underprivileged children.

            Could you provide information about:
            1. Training requirements for new volunteers
            2. Weekly time commitments
            3. Areas where volunteers are most needed

            I'm particularly passionate about improving reading comprehension among
            primary school students.

            Best regards,
            Neha Tamboli
            """,
            "category": "volunteer"
        },
        {
            "sender": "riddhima.toase@corporate.in",
            "subject": "CSR Partnership Proposal",
            "content": """
            Hello,

            I represent Toase Technologies, and we're looking to partner with non-profits
            for our Corporate Social Responsibility initiatives. We have a budget of
            ₹10,00,000 annually for education-focused programs.

            We're interested in:
            - Sponsoring scholarship programs
            - Providing technology infrastructure
            - Employee volunteer programs

            Please share your partnership framework and impact measurement processes.

            Regards,
            Riddhima Toase
            CSR Head, Toase Technologies
            """,
            "category": "partnership"
        },
        {
            "sender": "uday.patidar@gmail.com",
            "subject": "Monthly Donation Setup",
            "content": """
            Hi,

            I would like to set up a monthly recurring donation of ₹5,000 to support
            your education programs. I've been following your work for the past year
            and am impressed by the impact you're creating.

            Questions:
            1. How can I set up auto-debit for monthly donations?
            2. Will I receive monthly impact reports?
            3. Can I specify which program my donation supports?
            4. Are donations tax-deductible under 80G?

            Thank you for your important work!

            Uday Patidar
            """,
            "category": "donation"
        },
        {
            "sender": "rohan.rawat@donors.org",
            "subject": "Grant Application Feedback",
            "content": """
            Dear Grant Committee,

            I'm following up on our grant application submitted last month for the
            "Rural Education Initiative." Our proposal requested ₹25,00,000 for:

            - Building 3 learning centers in rural Maharashtra
            - Training 50 community educators
            - Providing learning materials for 1000 students
            - 18-month program duration

            We have strong community partnerships and a proven track record of
            successful program implementation. Our impact measurement framework
            includes quarterly assessments and annual evaluations.

            Could you provide an update on the application status?

            Thank you,
            Rohan Rawat
            Program Director
            """,
            "category": "partnership"
        }
    ]

    uploaded_count = 0
    for i, email in enumerate(sample_emails, 1):
        try:
            response = requests.post(f"{API_BASE}/emails/upload", json=email)
            if response.status_code == 201:
                data = response.json()
                print_success(f"Email {i}/4 uploaded: {email['subject'][:40]}...")
                uploaded_count += 1
            else:
                print_error(f"Failed to upload email {i}: {response.text}")
        except Exception as e:
            print_error(f"Error uploading email {i}: {str(e)}")

    print_info(f"\nTotal emails uploaded: {uploaded_count}/4")

    # Get statistics
    try:
        response = requests.get(f"{API_BASE}/emails/stats")
        if response.status_code == 200:
            stats = response.json()
            print_info(f"Database now has {stats['total_documents']} documents")
            print_info(f"Categories: {', '.join(stats['categories'])}")
    except Exception as e:
        print_warning(f"Could not fetch stats: {str(e)}")

    return uploaded_count > 0

def generate_quiz():
    """Generate a quiz session"""
    print_header("Generating Quiz")

    quiz_request = {
        "user_id": USER_ID,
        "num_questions": 3,
        "difficulty": "medium"
    }

    print_info(f"Requesting {quiz_request['num_questions']} questions at '{quiz_request['difficulty']}' difficulty...")

    try:
        response = requests.post(f"{API_BASE}/quiz/generate", json=quiz_request)
        if response.status_code == 200:
            session = response.json()
            print_success(f"Quiz session created: {session['session_id']}")
            print_info(f"Questions generated: {len(session['questions'])}")
            print_info(f"Max possible score: {session['max_possible_score']}")
            return session
        else:
            print_error(f"Failed to generate quiz: {response.text}")
            return None
    except Exception as e:
        print_error(f"Error generating quiz: {str(e)}")
        return None

def take_quiz(session):
    """Answer quiz questions"""
    print_header("Taking Quiz")

    results = []

    for i, question in enumerate(session['questions'], 1):
        print(f"\n{Colors.BOLD}Question {i}/{len(session['questions'])}{Colors.END}")
        print(f"{Colors.BLUE}━{Colors.END}" * 60)
        print(f"\n{Colors.BOLD}{question['text']}{Colors.END}")
        print(f"\n📊 Type: {question['question_type']}")
        print(f"🎯 Difficulty: {question['difficulty']}")
        print(f"💯 Points: {question['points']}")
        print(f"📚 Topic: {question['topic']}")

        if question.get('options'):
            print(f"\n{Colors.BOLD}Options:{Colors.END}")
            for idx, option in enumerate(question['options'], 1):
                print(f"  {idx}. {option}")

        # Simulate user answer (in real app, this would be user input)
        print(f"\n{Colors.YELLOW}⏳ Generating answer...{Colors.END}")
        time.sleep(1)

        # Sample answers (for demo purposes)
        sample_answers = [
            "Volunteers contribute by providing direct community engagement, bringing diverse skills, and offering flexible support for program delivery.",
            "CSR partnerships help non-profits through financial support, technical expertise, employee volunteering, and sustainable funding models.",
            "Donor stewardship involves building relationships through regular communication, impact reporting, recognition programs, and transparent operations."
        ]

        user_answer = sample_answers[i - 1] if i <= len(sample_answers) else "Sample answer for demonstration."

        print(f"{Colors.GREEN}📝 Your Answer:{Colors.END}")
        print(f"   {user_answer[:80]}...")

        # Submit answer
        try:
            answer_request = {
                "session_id": session['session_id'],
                "question_id": question['id'],
                "user_answer": user_answer
            }

            print(f"\n{Colors.YELLOW}⏳ Evaluating answer...{Colors.END}")
            response = requests.post(f"{API_BASE}/quiz/submit-answer", json=answer_request)

            if response.status_code == 200:
                evaluation = response.json()
                results.append(evaluation)

                # Display evaluation
                print(f"\n{Colors.BOLD}📊 Evaluation Result:{Colors.END}")
                print(f"{Colors.BLUE}━{Colors.END}" * 60)

                if evaluation['is_correct']:
                    print(f"{Colors.GREEN}✅ CORRECT!{Colors.END}")
                else:
                    print(f"{Colors.RED}❌ INCORRECT{Colors.END}")

                print(f"\n{Colors.BOLD}Score:{Colors.END} {evaluation['score']:.1f}/{evaluation['max_score']:.1f} ({evaluation['score']/evaluation['max_score']*100:.1f}%)")

                print(f"\n{Colors.BOLD}💬 Feedback:{Colors.END}")
                print(f"   {evaluation['feedback']}")

                print(f"\n{Colors.BOLD}📚 Detailed Explanation:{Colors.END}")
                print(f"   {evaluation['detailed_explanation'][:200]}...")

                if evaluation.get('strengths'):
                    print(f"\n{Colors.GREEN}✨ Strengths:{Colors.END}")
                    for strength in evaluation['strengths'][:2]:
                        print(f"   • {strength}")

                if evaluation.get('key_concepts_missed'):
                    print(f"\n{Colors.YELLOW}🎯 Concepts to Review:{Colors.END}")
                    for concept in evaluation['key_concepts_missed'][:2]:
                        print(f"   • {concept}")

                if evaluation.get('improvement_areas'):
                    print(f"\n{Colors.BLUE}🚀 Improvement Areas:{Colors.END}")
                    for area in evaluation['improvement_areas'][:2]:
                        print(f"   • {area}")

            else:
                print_error(f"Failed to submit answer: {response.text}")

        except Exception as e:
            print_error(f"Error submitting answer: {str(e)}")

        time.sleep(1)

    return results

def show_final_results(session, results):
    """Display final quiz results"""
    print_header("Quiz Complete - Final Results")

    total_score = sum(r['score'] for r in results)
    max_score = sum(r['max_score'] for r in results)
    percentage = (total_score / max_score * 100) if max_score > 0 else 0
    correct_count = sum(1 for r in results if r['is_correct'])

    print(f"{Colors.BOLD}📊 Your Performance:{Colors.END}\n")
    print(f"   Total Score:      {Colors.BOLD}{total_score:.1f}/{max_score:.1f}{Colors.END}")
    print(f"   Percentage:       {Colors.BOLD}{percentage:.1f}%{Colors.END}")
    print(f"   Correct Answers:  {Colors.BOLD}{correct_count}/{len(results)}{Colors.END}")
    print(f"   Incorrect:        {Colors.BOLD}{len(results) - correct_count}/{len(results)}{Colors.END}")

    # Grade
    if percentage >= 90:
        grade = f"{Colors.GREEN}A - Excellent!{Colors.END}"
    elif percentage >= 80:
        grade = f"{Colors.GREEN}B - Very Good!{Colors.END}"
    elif percentage >= 70:
        grade = f"{Colors.BLUE}C - Good{Colors.END}"
    elif percentage >= 60:
        grade = f"{Colors.YELLOW}D - Fair{Colors.END}"
    else:
        grade = f"{Colors.YELLOW}Needs Improvement{Colors.END}"

    print(f"\n   Grade:            {Colors.BOLD}{grade}{Colors.END}")

    # Complete session
    try:
        response = requests.post(f"{API_BASE}/quiz/session/{session['session_id']}/complete")
        if response.status_code == 200:
            print_success("\n✅ Session completed and saved!")
    except Exception as e:
        print_warning(f"Could not complete session: {str(e)}")

def main():
    """Main test workflow"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}")
    print("╔════════════════════════════════════════════════════════════╗")
    print("║                                                            ║")
    print("║       🎓 Non-Profit Quiz/Tutor Bot - Demo Test 🎓       ║")
    print("║                                                            ║")
    print("╚════════════════════════════════════════════════════════════╝")
    print(f"{Colors.END}\n")

    # Step 1: Check health
    if not check_health():
        return

    # Step 2: Upload emails
    if not upload_sample_emails():
        print_error("Failed to upload emails. Exiting.")
        return

    # Step 3: Generate quiz
    session = generate_quiz()
    if not session:
        print_error("Failed to generate quiz. Exiting.")
        return

    # Step 4: Take quiz
    results = take_quiz(session)
    if not results:
        print_error("Failed to complete quiz. Exiting.")
        return

    # Step 5: Show final results
    show_final_results(session, results)

    print_header("Test Complete!")
    print_success("All API endpoints tested successfully! 🎉")
    print_info(f"\nUser ID: {USER_ID}")
    print_info("View full API docs at: http://localhost:8000/docs")

if __name__ == "__main__":
    main()
