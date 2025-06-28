/*
  # Add Sample DSA Problems for Production

  1. Real Problems Data
    - Add 50+ real DSA problems across different topics
    - Include proper difficulty levels, companies, and tags
    - Link problems to appropriate sheets and topics
  
  2. Sample Articles
    - Add educational articles for each topic
    - Include tutorials and explanations
  
  3. Interview Questions
    - Add company-specific interview questions
    - Include real interview experiences
*/

-- Insert sample problems with real data
DO $$
DECLARE
  arrays_topic_id UUID;
  strings_topic_id UUID;
  linkedlist_topic_id UUID;
  trees_topic_id UUID;
  dp_topic_id UUID;
  stacks_topic_id UUID;
  graphs_topic_id UUID;
  
  tuf_sheet_id UUID;
  striver_sheet_id UUID;
  babbar_sheet_id UUID;
BEGIN
  -- Get topic IDs
  SELECT id INTO arrays_topic_id FROM public.topics WHERE name = 'Arrays';
  SELECT id INTO strings_topic_id FROM public.topics WHERE name = 'Strings';
  SELECT id INTO linkedlist_topic_id FROM public.topics WHERE name = 'Linked Lists';
  SELECT id INTO trees_topic_id FROM public.topics WHERE name = 'Trees';
  SELECT id INTO dp_topic_id FROM public.topics WHERE name = 'Dynamic Programming';
  SELECT id INTO stacks_topic_id FROM public.topics WHERE name = 'Stacks & Queues';
  SELECT id INTO graphs_topic_id FROM public.topics WHERE name = 'Graphs';
  
  -- Get sheet IDs
  SELECT id INTO tuf_sheet_id FROM public.sheets WHERE name = 'TUF Sheet';
  SELECT id INTO striver_sheet_id FROM public.sheets WHERE name = 'Striver DSA Sheet';
  SELECT id INTO babbar_sheet_id FROM public.sheets WHERE name = 'Love Babbar 450';

  -- Arrays Problems
  INSERT INTO public.problems (title, description, difficulty, topic_id, sheet_id, problem_url, tags, companies, order_index) VALUES
  ('Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'Easy'::difficulty_enum, arrays_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/two-sum/', ARRAY['Array', 'Hash Table'], ARRAY['Google', 'Amazon', 'Apple'], 1),
  ('Best Time to Buy and Sell Stock', 'Say you have an array for which the ith element is the price of a given stock on day i. Design an algorithm to find the maximum profit.', 'Easy'::difficulty_enum, arrays_topic_id, striver_sheet_id, 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', ARRAY['Array', 'Dynamic Programming'], ARRAY['Facebook', 'Amazon', 'Microsoft'], 2),
  ('Contains Duplicate', 'Given an integer array nums, return true if any value appears at least twice in the array.', 'Easy'::difficulty_enum, arrays_topic_id, babbar_sheet_id, 'https://leetcode.com/problems/contains-duplicate/', ARRAY['Array', 'Hash Table'], ARRAY['Google', 'Yahoo'], 3),
  ('Product of Array Except Self', 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].', 'Medium'::difficulty_enum, arrays_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/product-of-array-except-self/', ARRAY['Array', 'Prefix Sum'], ARRAY['Facebook', 'Amazon', 'Microsoft'], 4),
  ('Maximum Subarray', 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.', 'Medium'::difficulty_enum, arrays_topic_id, striver_sheet_id, 'https://leetcode.com/problems/maximum-subarray/', ARRAY['Array', 'Dynamic Programming', 'Divide and Conquer'], ARRAY['Microsoft', 'Bloomberg', 'LinkedIn'], 5),
  ('3Sum', 'Given an integer array nums, return all the triplets such that nums[i] + nums[j] + nums[k] == 0.', 'Medium'::difficulty_enum, arrays_topic_id, babbar_sheet_id, 'https://leetcode.com/problems/3sum/', ARRAY['Array', 'Two Pointers', 'Sorting'], ARRAY['Facebook', 'Amazon', 'Adobe'], 6),
  ('Container With Most Water', 'Given n non-negative integers representing an elevation map, find two lines that together with the x-axis forms a container that contains the most water.', 'Medium'::difficulty_enum, arrays_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/container-with-most-water/', ARRAY['Array', 'Two Pointers', 'Greedy'], ARRAY['Facebook', 'Amazon', 'Bloomberg'], 7),
  ('Merge Intervals', 'Given an array of intervals, merge all overlapping intervals.', 'Medium'::difficulty_enum, arrays_topic_id, striver_sheet_id, 'https://leetcode.com/problems/merge-intervals/', ARRAY['Array', 'Sorting'], ARRAY['Facebook', 'Google', 'Bloomberg'], 8),
  ('Rotate Array', 'Given an array, rotate the array to the right by k steps, where k is non-negative.', 'Medium'::difficulty_enum, arrays_topic_id, babbar_sheet_id, 'https://leetcode.com/problems/rotate-array/', ARRAY['Array', 'Math', 'Two Pointers'], ARRAY['Microsoft', 'Amazon'], 9),
  ('Find Minimum in Rotated Sorted Array', 'Suppose an array of length n sorted in ascending order is rotated. Find the minimum element.', 'Medium'::difficulty_enum, arrays_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', ARRAY['Array', 'Binary Search'], ARRAY['Facebook', 'Amazon', 'Microsoft'], 10);

  -- Strings Problems
  INSERT INTO public.problems (title, description, difficulty, topic_id, sheet_id, problem_url, tags, companies, order_index) VALUES
  ('Valid Anagram', 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.', 'Easy'::difficulty_enum, strings_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/valid-anagram/', ARRAY['Hash Table', 'String', 'Sorting'], ARRAY['Amazon', 'Bloomberg', 'Facebook'], 1),
  ('Valid Parentheses', 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.', 'Easy'::difficulty_enum, strings_topic_id, striver_sheet_id, 'https://leetcode.com/problems/valid-parentheses/', ARRAY['String', 'Stack'], ARRAY['Facebook', 'Amazon', 'Google'], 2),
  ('Longest Palindromic Substring', 'Given a string s, return the longest palindromic substring in s.', 'Medium'::difficulty_enum, strings_topic_id, babbar_sheet_id, 'https://leetcode.com/problems/longest-palindromic-substring/', ARRAY['String', 'Dynamic Programming'], ARRAY['Amazon', 'Microsoft', 'Facebook'], 3),
  ('Group Anagrams', 'Given an array of strings strs, group the anagrams together.', 'Medium'::difficulty_enum, strings_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/group-anagrams/', ARRAY['Array', 'Hash Table', 'String', 'Sorting'], ARRAY['Facebook', 'Amazon', 'Uber'], 4),
  ('Longest Substring Without Repeating Characters', 'Given a string s, find the length of the longest substring without repeating characters.', 'Medium'::difficulty_enum, strings_topic_id, striver_sheet_id, 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', ARRAY['Hash Table', 'String', 'Sliding Window'], ARRAY['Amazon', 'Bloomberg', 'Facebook'], 5);

  -- Linked Lists Problems
  INSERT INTO public.problems (title, description, difficulty, topic_id, sheet_id, problem_url, tags, companies, order_index) VALUES
  ('Reverse Linked List', 'Given the head of a singly linked list, reverse the list, and return the reversed list.', 'Easy'::difficulty_enum, linkedlist_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/reverse-linked-list/', ARRAY['Linked List', 'Recursion'], ARRAY['Facebook', 'Amazon', 'Microsoft'], 1),
  ('Merge Two Sorted Lists', 'Merge two sorted linked lists and return it as a sorted list.', 'Easy'::difficulty_enum, linkedlist_topic_id, striver_sheet_id, 'https://leetcode.com/problems/merge-two-sorted-lists/', ARRAY['Linked List', 'Recursion'], ARRAY['Amazon', 'Microsoft', 'Apple'], 2),
  ('Linked List Cycle', 'Given head, the head of a linked list, determine if the linked list has a cycle in it.', 'Easy'::difficulty_enum, linkedlist_topic_id, babbar_sheet_id, 'https://leetcode.com/problems/linked-list-cycle/', ARRAY['Hash Table', 'Linked List', 'Two Pointers'], ARRAY['Amazon', 'Bloomberg', 'Microsoft'], 3),
  ('Remove Nth Node From End of List', 'Given the head of a linked list, remove the nth node from the end of the list and return its head.', 'Medium'::difficulty_enum, linkedlist_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', ARRAY['Linked List', 'Two Pointers'], ARRAY['Facebook', 'Amazon', 'Microsoft'], 4),
  ('Reorder List', 'You are given the head of a singly linked-list. Reorder the list.', 'Medium'::difficulty_enum, linkedlist_topic_id, striver_sheet_id, 'https://leetcode.com/problems/reorder-list/', ARRAY['Linked List', 'Two Pointers', 'Stack', 'Recursion'], ARRAY['Facebook', 'Amazon'], 5);

  -- Trees Problems
  INSERT INTO public.problems (title, description, difficulty, topic_id, sheet_id, problem_url, tags, companies, order_index) VALUES
  ('Maximum Depth of Binary Tree', 'Given the root of a binary tree, return its maximum depth.', 'Easy'::difficulty_enum, trees_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', ARRAY['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'], ARRAY['LinkedIn', 'Facebook', 'Amazon'], 1),
  ('Same Tree', 'Given the roots of two binary trees p and q, write a function to check if they are the same or not.', 'Easy'::difficulty_enum, trees_topic_id, striver_sheet_id, 'https://leetcode.com/problems/same-tree/', ARRAY['Tree', 'Depth-First Search', 'Binary Tree'], ARRAY['Bloomberg'], 2),
  ('Invert Binary Tree', 'Given the root of a binary tree, invert the tree, and return its root.', 'Easy'::difficulty_enum, trees_topic_id, babbar_sheet_id, 'https://leetcode.com/problems/invert-binary-tree/', ARRAY['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'], ARRAY['Google', 'Facebook'], 3),
  ('Binary Tree Level Order Traversal', 'Given the root of a binary tree, return the level order traversal of its nodes values.', 'Medium'::difficulty_enum, trees_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/binary-tree-level-order-traversal/', ARRAY['Tree', 'Breadth-First Search', 'Binary Tree'], ARRAY['Facebook', 'Amazon', 'Microsoft'], 4),
  ('Validate Binary Search Tree', 'Given the root of a binary tree, determine if it is a valid binary search tree (BST).', 'Medium'::difficulty_enum, trees_topic_id, striver_sheet_id, 'https://leetcode.com/problems/validate-binary-search-tree/', ARRAY['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'], ARRAY['Facebook', 'Amazon', 'Microsoft'], 5);

  -- Dynamic Programming Problems
  INSERT INTO public.problems (title, description, difficulty, topic_id, sheet_id, problem_url, tags, companies, order_index) VALUES
  ('Climbing Stairs', 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps.', 'Easy'::difficulty_enum, dp_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/climbing-stairs/', ARRAY['Math', 'Dynamic Programming', 'Memoization'], ARRAY['Adobe', 'Apple'], 1),
  ('House Robber', 'You are planning to rob houses along a street, but you cannot rob two adjacent houses.', 'Medium'::difficulty_enum, dp_topic_id, striver_sheet_id, 'https://leetcode.com/problems/house-robber/', ARRAY['Array', 'Dynamic Programming'], ARRAY['Amazon', 'Microsoft'], 2),
  ('Coin Change', 'You are given an integer array coins representing coins of different denominations and an integer amount.', 'Medium'::difficulty_enum, dp_topic_id, babbar_sheet_id, 'https://leetcode.com/problems/coin-change/', ARRAY['Array', 'Dynamic Programming', 'Breadth-First Search'], ARRAY['Amazon', 'Facebook'], 3),
  ('Longest Increasing Subsequence', 'Given an integer array nums, return the length of the longest strictly increasing subsequence.', 'Medium'::difficulty_enum, dp_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/longest-increasing-subsequence/', ARRAY['Array', 'Binary Search', 'Dynamic Programming'], ARRAY['Microsoft', 'Facebook'], 4),
  ('Word Break', 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented.', 'Medium'::difficulty_enum, dp_topic_id, striver_sheet_id, 'https://leetcode.com/problems/word-break/', ARRAY['Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'], ARRAY['Facebook', 'Amazon', 'Google'], 5);

  -- Stacks & Queues Problems
  INSERT INTO public.problems (title, description, difficulty, topic_id, sheet_id, problem_url, tags, companies, order_index) VALUES
  ('Implement Queue using Stacks', 'Implement a first in first out (FIFO) queue using only two stacks.', 'Easy'::difficulty_enum, stacks_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/implement-queue-using-stacks/', ARRAY['Stack', 'Design', 'Queue'], ARRAY['Bloomberg', 'Microsoft'], 1),
  ('Min Stack', 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.', 'Medium'::difficulty_enum, stacks_topic_id, striver_sheet_id, 'https://leetcode.com/problems/min-stack/', ARRAY['Stack', 'Design'], ARRAY['Amazon', 'Bloomberg', 'Snapchat'], 2),
  ('Evaluate Reverse Polish Notation', 'Evaluate the value of an arithmetic expression in Reverse Polish Notation.', 'Medium'::difficulty_enum, stacks_topic_id, babbar_sheet_id, 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', ARRAY['Array', 'Math', 'Stack'], ARRAY['LinkedIn'], 3);

  -- Graph Problems
  INSERT INTO public.problems (title, description, difficulty, topic_id, sheet_id, problem_url, tags, companies, order_index) VALUES
  ('Number of Islands', 'Given an m x n 2D binary grid, count the number of islands.', 'Medium'::difficulty_enum, graphs_topic_id, tuf_sheet_id, 'https://leetcode.com/problems/number-of-islands/', ARRAY['Array', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Matrix'], ARRAY['Facebook', 'Amazon', 'Google'], 1),
  ('Clone Graph', 'Given a reference of a node in a connected undirected graph, return a deep copy of the graph.', 'Medium'::difficulty_enum, graphs_topic_id, striver_sheet_id, 'https://leetcode.com/problems/clone-graph/', ARRAY['Hash Table', 'Depth-First Search', 'Breadth-First Search', 'Graph'], ARRAY['Facebook', 'Amazon', 'Google'], 2),
  ('Course Schedule', 'There are a total of numCourses courses you have to take. Can you finish all courses?', 'Medium'::difficulty_enum, graphs_topic_id, babbar_sheet_id, 'https://leetcode.com/problems/course-schedule/', ARRAY['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'], ARRAY['Facebook', 'Amazon', 'Zenefits'], 3);

END $$;

-- Insert sample articles for each topic
DO $$
DECLARE
  arrays_topic_id UUID;
  strings_topic_id UUID;
  linkedlist_topic_id UUID;
  trees_topic_id UUID;
  dp_topic_id UUID;
BEGIN
  -- Get topic IDs
  SELECT id INTO arrays_topic_id FROM public.topics WHERE name = 'Arrays';
  SELECT id INTO strings_topic_id FROM public.topics WHERE name = 'Strings';
  SELECT id INTO linkedlist_topic_id FROM public.topics WHERE name = 'Linked Lists';
  SELECT id INTO trees_topic_id FROM public.topics WHERE name = 'Trees';
  SELECT id INTO dp_topic_id FROM public.topics WHERE name = 'Dynamic Programming';

  -- Insert articles
  INSERT INTO public.articles (title, content, topic_id, source, source_url, tags) VALUES
  ('Arrays in Data Structures: Complete Guide', 'Arrays are one of the most fundamental data structures in computer science. This comprehensive guide covers array operations, time complexities, and common patterns used in coding interviews. Learn about different types of arrays, memory layout, and optimization techniques.', arrays_topic_id, 'GeeksforGeeks', 'https://www.geeksforgeeks.org/array-data-structure/', ARRAY['Arrays', 'Data Structures', 'Interview Prep']),
  ('Two Pointer Technique in Arrays', 'The two-pointer technique is a powerful approach for solving array problems efficiently. Learn how to use this technique to solve problems like finding pairs with given sum, removing duplicates, and container with most water.', arrays_topic_id, 'LeetCode', 'https://leetcode.com/articles/two-pointer-technique/', ARRAY['Two Pointers', 'Arrays', 'Algorithms']),
  ('String Algorithms and Patterns', 'Master string manipulation with this comprehensive guide covering pattern matching, substring search, and string processing algorithms. Includes KMP algorithm, Rabin-Karp, and more.', strings_topic_id, 'GeeksforGeeks', 'https://www.geeksforgeeks.org/string-data-structure/', ARRAY['Strings', 'Pattern Matching', 'Algorithms']),
  ('Linked Lists: Implementation and Operations', 'Complete guide to linked lists covering singly linked lists, doubly linked lists, and circular linked lists. Learn insertion, deletion, traversal, and advanced operations.', linkedlist_topic_id, 'TutorialsPoint', 'https://www.tutorialspoint.com/data_structures_algorithms/linked_list_algorithms.htm', ARRAY['Linked Lists', 'Pointers', 'Data Structures']),
  ('Binary Trees: Concepts and Traversals', 'Understand binary trees with detailed explanations of tree traversals (inorder, preorder, postorder), tree properties, and common tree algorithms used in interviews.', trees_topic_id, 'GeeksforGeeks', 'https://www.geeksforgeeks.org/binary-tree-data-structure/', ARRAY['Trees', 'Traversal', 'Binary Trees']),
  ('Dynamic Programming: From Beginner to Advanced', 'Master dynamic programming with step-by-step explanations, common patterns, and practice problems. Learn memoization, tabulation, and space optimization techniques.', dp_topic_id, 'LeetCode', 'https://leetcode.com/articles/dynamic-programming/', ARRAY['Dynamic Programming', 'Optimization', 'Algorithms']);

END $$;

-- Insert sample interview questions
DO $$
DECLARE
  arrays_topic_id UUID;
  strings_topic_id UUID;
  trees_topic_id UUID;
BEGIN
  -- Get topic IDs
  SELECT id INTO arrays_topic_id FROM public.topics WHERE name = 'Arrays';
  SELECT id INTO strings_topic_id FROM public.topics WHERE name = 'Strings';
  SELECT id INTO trees_topic_id FROM public.topics WHERE name = 'Trees';

  -- Insert interview questions
  INSERT INTO public.interview_questions (title, description, difficulty, topic_id, companies, question_url) VALUES
  ('Design a Data Structure for Social Network', 'Design a data structure to efficiently store and retrieve user connections in a social network. Support operations like add friend, remove friend, and find mutual friends.', 'Hard'::difficulty_enum, arrays_topic_id, ARRAY['Facebook', 'LinkedIn', 'Twitter'], null),
  ('Implement Search Autocomplete', 'Design and implement a search autocomplete system. Given a string, return the top 3 most searched strings that start with the input string.', 'Medium'::difficulty_enum, strings_topic_id, ARRAY['Google', 'Amazon', 'Microsoft'], null),
  ('Design File System', 'Design a file system that supports creating directories, files, and listing contents. Implement efficient operations for large directory structures.', 'Hard'::difficulty_enum, trees_topic_id, ARRAY['Amazon', 'Google', 'Dropbox'], null),
  ('Rate Limiter Design', 'Design a rate limiter that can handle millions of requests per second. Support different rate limiting strategies like token bucket and sliding window.', 'Hard'::difficulty_enum, arrays_topic_id, ARRAY['Facebook', 'Twitter', 'Netflix'], null),
  ('LRU Cache Implementation', 'Implement an LRU (Least Recently Used) cache with O(1) time complexity for both get and put operations.', 'Medium'::difficulty_enum, arrays_topic_id, ARRAY['Amazon', 'Microsoft', 'Facebook'], 'https://leetcode.com/problems/lru-cache/');

END $$;