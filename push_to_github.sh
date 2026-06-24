#!/bin/bash

# Magnitax Client Portal GitHub Push Script
# This script securely asks for your GitHub Personal Access Token (PAT),
# creates the repository on your GitHub account, and pushes the codebase.

clear
echo "===================================================="
echo -e "\033[1;33mDesigning Magnitax Client Portal - GitHub Auto-Push\033[0m"
echo "===================================================="
echo ""

# 1. Ask for GitHub Username
read -p "Enter your GitHub Username (default: whoisdesirtech): " username
username=${username:-whoisdesirtech}

# 2. Ask for Personal Access Token securely
echo -n "Enter your GitHub Personal Access Token (PAT): "
read -s token
echo ""

if [ -z "$token" ]; then
  echo -e "\033[1;31mError: Token cannot be empty.\033[0m"
  exit 1
fi

echo ""
echo "Checking if repository already exists on GitHub..."

# Check if repo exists
status_code=$(curl -s -o /dev/null -w "%{http_code}" -H "Authorization: token $token" https://api.github.com/repos/$username/Designing-Magnitax-Client-Portal)

if [ "$status_code" -eq 200 ]; then
  echo "Repository already exists on GitHub. Proceeding to push..."
elif [ "$status_code" -eq 404 ]; then
  echo "Repository does not exist. Creating 'Designing-Magnitax-Client-Portal' on GitHub..."
  
  create_status=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: token $token" \
    -H "Content-Type: application/json" \
    -d '{"name":"Designing-Magnitax-Client-Portal", "description":"Secure Client Portal for Magnitax.com - MERN stack specs and UI prototype", "private":false}' \
    https://api.github.com/user/repos)
    
  if [ "$create_status" -eq 201 ]; then
    echo -e "\033[1;32mRepository successfully created on GitHub!\033[0m"
  else
    echo -e "\033[1;31mFailed to create repository. API Status Code: $create_status\033[0m"
    exit 1
  fi
else
  echo -e "\033[1;31mError authenticating with GitHub. Please check your token and try again. (Status: $status_code)\033[0m"
  exit 1
fi

echo "Linking remote and pushing code..."
# Remove existing remote if any
git remote remove origin 2>/dev/null

# Add remote with embedded token for authentication
git remote add origin "https://$username:$token@github.com/$username/Designing-Magnitax-Client-Portal.git"

# Push code
git branch -M main
echo ""
if git push -u origin main; then
  echo ""
  echo "===================================================="
  echo -e "\033[1;32mSuccess! Your project is now live at:\033[0m"
  echo -e "\033[1;36mhttps://github.com/$username/Designing-Magnitax-Client-Portal\033[0m"
  echo "===================================================="
else
  echo ""
  echo -e "\033[1;31mFailed to push code to GitHub.\033[0m"
fi

# Clean up remote URL to remove token from plain text git config for security
git remote set-url origin "https://github.com/$username/Designing-Magnitax-Client-Portal.git"
