var levelMap = [
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', 'V', 'B', 'B', 'B', 'B', 'm', 'V', 'B', 'B', 'B', 'B', 'm', ' ', ' '],
	[' ', ' ', 'X', 'B', 'O', 'P', 'B', 'W', 'e', 'B', 'O', 'P', 'B', 'n', ' ', ' '],
	['w', 'w', 'W', 'B', 'o', 'p', 'B', 'n', 'X', 'B', 'o', 'p', 'B', 'e', 'w', 'w'],
	[' ', ' ', 'X', 'B', 'B', 'B', 'B', 'W', 'e', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	[' ', ' ', 'v', 'b', 'b', 'b', 'b', 'N', 'v', 'b', 'b', 'b', 'b', 'N', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' (p)',' ',' ',' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'V', 'g', 'g', 'm', 'V', 'g', 'g', 'm', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'r', 'R', 'n', 'X', 'R', 'r', 'n', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'g', 'g', 'n', 'X', 'g', 'g', 'n', ' ', ' ', ' ', ' '],
	['V', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'm'],
	['e', 'R', 'B', 'r', 'B', 'r', 'B', 'r', 'r', 'B', 'r', 'B', 'r', 'B', 'R', 'W'],
	['X', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'n'],
	['v', 'b', 'b', 'b', 'b', 'b', 'A', 'B', 'B', 'a', 'b', 'b', 'b', 'b', 'b', 'N'],
	[' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'g', 'm', 'V', 'g', 'g', 'g', 'g', 'g ','g', 'm', 'V', 'g', 'g', 'g'],
	['r', 'R', 'r', 'W', 'e', 'g', 'g', 'g', 'g', 'g', 'g', 'W', 'e', 'r', 'R', 'g'],
	['g', 'r', 'g', 'n', 'X', 'g', 'g', 'g', 'g', 'g', 'g', 'n', 'X', 'g', 'r', 'g'],
	['b', 'b', 'b', 'N', 'X', 'r', 'r', 'g', 'g', 'r', 'r', 'n', 'v', 'b', 'b', 'b'],
	[' ', ' ', ' ', ' ', 'Z', 'M', 'M', 'g', 'g', 'M', 'M', 'z', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'r', 'r', 'g', 'g', 'r', 'r', 'n', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'Z', 'M', 'M', 'G', 'G', 'M', 'M', 'z', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'r', 'r', 'g', 'g', 'r', 'r', 'n', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'Z', 'M', 'M', 'g', 'g', 'M', 'M', 'z', ' ', ' ', ' ', ' '],
	[' ', ' ', 'V', 'K', 'L', 'r', 'r', 'g', 'g', 'r', 'r', 'K', 'L', 'm', ' ', ' '],
	['M', 'M', 'M', 'k', 'l', 'B', 'B', 'B', 'B', 'B', 'B', 'k','l','M','M','M'],
	['g', 'g', 'g', 'B (-)', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B (-)', 'B', 'g', 'g', 'g'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'K', 'L', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'k', 'l', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'B (p)', 'B', 'B', 'B', 'B','B','r','g','r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['r', 'g', 'r', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'r', 'g', 'r'],
	['g', 'g', 'g', 'B', 'B', 'B', 'B', 'R', 'R', 'B', 'B', 'B', 'B', 'g', 'g', 'g'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g'],
	['b', 'A', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'a', 'b', 'b'],
	[' ', 'X', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'n', ' ', ' '],
	[' ', 'Z', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'z', ' ', ' '],
	[' ', 'X', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g (p)','r','g','r','n', ' ', ' '],
	[' ', 'v', 'b', 'b', 'A', 'r', 'g', 'r', 'g', 'r', 'a', 'b', 'b', 'N', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'g', 'r', 'g', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'Z', 'r', 'g', 'r', 'g', 'r', 'n', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'g', 'r', 'g', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b', 'b', 'b', 'N', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' (p)',' ',' ',' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'r', 'g', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'm', ' ', ' '],
	['r', 'G', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'g', 'r', 'g', 'B', 'n', ' ', ' '],
	['g', 'r', 'g', 'B', 'B', 'g', 'g', 'B', 'B', 'r', 'G', 'r', 'B', 'n', ' ', ' '],
	['B', 'B (-)', 'B', 'B', 'r', 'r', 'r', 'r', 'B', 'g', 'r', 'g', 'B', 'z', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'g', 'g', 'B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	['B', 'B', 'B', 'K', 'L', 'K', 'L', 'K', 'L', 'B', 'B', 'B', 'B', 'W', 'w', 'w'],
	['B', 'B', 'B', 'k', 'l', 'k', 'l', 'k', 'l', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'a', 'b', 'b', 'N', ' ', ' '],
	['b', 'b', 'b', 'b', 'b', 'A', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', 'Z', 'g', 'r', 'g', 'r', 'z', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', 'X', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', 'V', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'm', ' ', ' ', ' '],
	[' ', ' ', ' ', 'X', 'B', 'M', 'r', 'g', 'r', 'g', 'M', 'B', 'n', ' ', ' ', ' '],
	[' ', ' ', ' ', 'Z', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'z', ' ', ' ', ' '],
	[' ', ' ', ' ', 'Z', 'B', 'M', 'r', 'g', 'r', 'g', 'M', 'B', 'z', ' ', ' ', ' '],
	[' ', ' ', ' ', 'v', 'b', 'b', 'A', 'B', 'B', 'a', 'b', 'b', 'N', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'r', 'n', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'r', 'g', 'm', ' ', ' ', 'Z', 'K', 'L', 'z', ' ', ' ', 'V', 'g', 'r', 'g'],
	['g', 'r', 'g', 'W', 'w', 'w', 'e', 'k', 'l', 'W', 'w', 'w', 'e', 'g', 'r', 'g'],
	['g', 'r', 'g', 'n', ' ', ' ', 'v', 'b', 'b', 'N', ' ', ' ', 'X', 'g', 'r', 'g'],
	['g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g', 'r', 'g'],
	['g', 'r', 'g', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'g', 'r', 'g'],
	['g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' (p)',' ',' ',' ', 'X', 'g', 'r', 'g'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'r', 'G', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'r', 'g', 'r', 'B'],
	['B', 'g', 'g', 'g', 'g', 'g', 'g', 'B', 'B', 'g', 'g', 'g', 'g', 'g', 'g', 'B'],
	['B', 'r', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B (-)', 'B', 'r', 'G', 'r', 'B'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B', 'M', 'B', 'M', 'B', 'M', 'B', 'M', 'B', 'M', 'a', 'b', 'b', 'b', 'b', 'b'],
	['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'n', ' ', ' ', ' ', ' ', ' '],
	['g', 'K', 'L', 'g', 'g', 'g', 'g', 'K', 'L', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	['r', 'k', 'l', 'r', 'r', 'r', 'r', 'k', 'l', 'r', 'z', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'g', 'n', ' ', ' ', ' ', ' ', ' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'n', ' ', ' ', ' ', ' ', ' '],
	['B', 'B (4)', 'B', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B', 'B','B','B','B','B'],
	['B', 'g', 'r', 'g', 'r', 'B', 'B', 'g', 'r', 'g', 'B', 'B', 'B', 'B', 'B', 'B'],
	['B (4)', 'g', 'r', 'g', 'r', 'B', 'B', 'M', 'r', 'M', 'B', 'B','B','B','B','B'],
	['b', 'b', 'A', 'g', 'r', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B'],
	[' ', ' (4)', 'X', 'g', 'r', 'B', 'B', 'B', 'B', 'B ','B', 'B', 'g','R','g','B'],
	[' ', ' ', 'X', 'B', 'B', 'B', 'B', 'M', 'g', 'M', 'B', 'B', 'M', 'g', 'M', 'B'],
	[' (4)', ' ', 'Z', 'B', 'B', 'B', 'B', 'g', 'R', 'g', 'B', 'B', 'B','B','B','B'],
	[' ', ' ', 'Z', 'K', 'L', 'B', 'B', 'M', 'g', 'M', 'B', 'B', 'B', 'B', 'B', 'B'],
	['w', 'w (4)', 'e', 'k', 'l', 'B', 'B', 'B', 'B', 'B', 'B', 'B','M','g','M','B'],
	[' ', ' ', 'v', 'b', 'A', 'K', 'L', 'B', 'B', 'B', 'B', 'B', 'g', 'R', 'g', 'B'],
	[' (4)', ' ', ' ', ' ', 'X', 'k', 'l', 'B', 'B', 'B', 'B', 'B', 'M','g','M','B'],
	[' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b', 'b', 'A', 'B', 'B', 'B', 'B', 'B', 'B'],
	[' ',' ',' ',' ',' ', ' ', ' ', ' ', ' ', 'Z', 'B', 'B', 'B', 'B', 'B (4)', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b', 'b', 'b', 'b'],
	[' ',' ',' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' (4)'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ',' ',' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' (4)', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ',' ',' ',' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'V', 'r (4)'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'R'],
	[' ',' ',' ',' ',' ', ' ', ' ', ' (p)',' ',' ',' ', ' ', ' ', ' ', 'Z (4)', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b'],
	[' ',' ',' ',' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' (4)'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' (!)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' (@)',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'r', 'g', 'R ','g', 'r', 'g', 'm', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B ','B', 'B', 'B', 'z', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B ','B', 'B', 'B', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['B', 'B', 'B', 'B ','B', 'B', 'B', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'M', 'r ','r', 'B', 'B', 'n ', ' ', ' ',' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'B', 'r', 'r', 'B', 'B', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['g', 'g', 'B', 'r', 'r', 'B', 'B', 'n', ' ', ' ', ' ', ' ', ' (5)',' ',' ',' '],
	['g', 'g', 'M', 'r', 'r', 'B', 'B', 'z', ' ', ' ', ' ', ' ', ' (5)',' ',' ',' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'z ', ' ', ' ', ' ',' ', ' (5)',' ',' ',' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'z', ' ', ' ', ' ', ' ', ' (5)',' ',' ',' '],
	['B', 'B', 'B', 'B ', 'B', 'B', 'B', 'n', ' ', ' ', 'V', 'r','r', 'r', 'm', ' '],
	['B', 'r', 'g', 'r (5)', 'B', 'B', 'B', 'n', ' ', ' ', 'X', 'r','r','r','n',' '],
	['B', 'r', 'g', 'B (5)', 'r', 'K', 'L', 'W', 'w', 'w', 'e', 'B','M','B','z',' '],
	['B', 'r', 'g', 'B (5)', 'B', 'k', 'l', 'n', ' ', ' ', 'X', 'B','g','g','n',' '],
	['B', 'r', 'g', 'B (5)', 'B', 'M', 'r', 'z', ' ', ' ', 'Z', 'B','g','g','n',' '],
	['b', 'b', 'b', 'A', 'r', 'g', 'r', 'n', ' ', ' ', 'X', 'B','B ', 'B', 'n', ' '],
	[' ', ' ', ' ', 'X', 'r', 'g', 'r', 'W', 'w', 'w', 'e', 'r','R (5)','r','z',' '],
	[' ', ' ', ' ', 'Z', 'B', 'B (-)','B','n',' ', ' ', 'X', 'B','r (5)','B','n',' '],
	[' ', ' ', ' ', 'Z', 'B', 'B', 'B', 'n', ' ',' (p)','X','K','L (5)','r','n',' '],
	[' ', ' ', ' ', 'v', 'b', 'b', 'b', 'N', ' ', ' ', 'X', 'k','l (5)','r','W','w'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'B', 'M', 'B', 'W', 'w'],
	[' ', ' ', ' ', ' (5)', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b','b','b','N', ' '],
	[' ', ' ', ' ', ' (5)', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ', ' '],
	[' ', ' ', ' ', ' (5)', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ', ' '],
	[' ', ' ', ' ', ' (5)', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ','  (4)',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'V', 'B ','B','M','B','g','B (4)'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'M', 'B', 'M', 'B', 'M', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'K', 'L','M','g','r (4)','B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'k', 'l', 'M', 'B', 'M', 'B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'M', 'B','M','K','L','B (4)'],
	['r', 'r', 'g', 'r', 'r', 'm', ' ', ' ', ' ', 'X', 'g', 'R', 'M', 'k', 'l', 'B'],
	['g', 'g', 'g', 'g', 'g', 'n', ' ', ' ',' ','X','M','B', 'M', 'B', 'M (4)', 'B'],
	['r', 'G', 'g', 'r', 'r', 'n', ' ', ' ', ' ', 'X', 'M', 'B ','M', 'B', 'M', 'B'],
	['g', 'r', 'g', 'g', 'g', 'n', ' ',' ',' ','X','M','B ', 'M', 'B', 'M', 'B (4)'],
	['g', 'r', 'g', 'r', 'a', 'N', 'V', 'r', 'g', 'r', 'g', 'r', 'g', 'r', 'g', 'r'],
	['g', 'r (4)', 'g', 'r', 'n', ' ', 'X', 'g', 'r', 'g', 'r', 'g','r','g','G','g'],
	['g', 'r', 'g', 'r', 'W', 'w', 'e', 'M', 'g', 'r', 'g', 'M', 'g', 'r', 'g', 'M'],
	['g (4)', 'r', 'G', 'r', 'W', 'w', 'e', 'B', 'B', 'B', 'B', 'B','M','r','M','B'],
	['g', 'r', 'g', 'R', 'n', ' ', 'v', 'b', 'b', 'b', 'A', 'B', 'g', 'M', 'g', 'B'],
	['b ', 'b(4)', 'b', 'b', 'N', ' ', ' ', ' ', ' ', ' ', 'X', 'B (-)','M','r','M','B'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'B', 'B', 'B', 'B', 'B'],
	[' (4)', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z', 'g','g','M','r', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' (p)', ' ', 'X', 'g', 'g', 'B', 'r', 'r'],
	[' ', ' (4)', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'g','g','M','r', 'r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X (2)', 'g','G','B','r','r'],
	[' (4)', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ','X (2)','g','g','M','r','r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X (2)', 'g','g','B','R','r'],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'Z (2)', 'g','g','M','r','r'],
	['r', 'g', 'r', 'm', ' ', ' ', ' ', ' ', ' ', ' ', 'Z (2)', 'g','g','B','r','r'],
	['M', 'B', 'M', 'z', ' ', ' ', ' ', ' ', ' ', ' ', 'X (2)', 'g','g','M','r','r'],
	['r', 'g', 'r', 'n', ' ', ' ', ' ', ' ', ' ', ' ', 'v (2)', 'b','A','B','r','r'],
	['g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' (2)', ' ', 'Z','M','B','M'],
	['r', 'G', 'r', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', 'v', 'b', 'b', 'b'],
	['g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	['r', 'g', 'r', 'z', ' ', ' (2)', ' ', ' ', ' ', ' ',' ',' ',' ', ' ', ' ', ' '],
	['g', 'M', 'g', 'n', ' ', ' (2)', ' ', ' ', ' ', ' ',' ',' ',' ', ' ', ' ', ' '],
	['r', 'g', 'r', 'n', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	['b', 'b', 'b', 'N', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' (2)', ' ', ' ', ' ',' ',' ',' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' (2)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' (2)', ' ', ' ', ' ', ' ',' ',' ',' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' (3)',' ',' '],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'm', ' ', ' ', ' '],
	['r', 'r', 'r ', 'B', 'g', 'g', 'g', 'B', 'r', 'r', 'r', 'B','n', ' ', ' ', ' '],
	['r', 'G', 'r', 'B', 'g', 'g', 'g', 'B', 'r', 'G', 'r', 'B', 'z', ' ', ' ', ' '],
	['r', 'r', 'r (3)', 'B', 'g', 'g', 'g', 'B', 'r', 'r', 'r', 'B','W','w','w','w'],
	['B', 'B', 'B ', 'B', 'B', 'B (-)', 'B', 'B', 'B', 'B', 'B','B','W','w','w','w'],
	['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'n', ' ', ' ', ' '],
	['r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'W', 'w', 'w', 'w'],
	['M', 'g', 'M', 'g', 'M', 'g', 'M', 'B', 'M', 'B', 'M', 'B', 'n', ' ', ' ', ' '],
	['r', 'g', 'r', 'g', 'r', 'g', 'a', 'b', 'b', 'b', 'b', 'b', 'N', ' ', ' ', ' '],
	['r', 'g', 'M', 'G', 'r', 'G', 'n', ' ', ' ', ' ', ' ', '  (1)',' ',' ',' ',' '],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' (p)',' ',' ','  (1)',' ',' ',' ',' '],
	['M', 'g', 'r', 'g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','V','K','L'],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','X','k','l'],
	['R', 'g', 'M', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','Z','K','L'],
	['r', 'g', 'r', 'g', 'r', 'g', 'W','w','w','w','w', 'w (1)', 'w', 'e', 'k', 'l'],
	['M', 'g', 'M', 'g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','X','K','L'],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','X','k','l'],
	['M', 'g', 'M', 'g', 'M', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ','v','b','b'],
	['r', 'g', 'r', 'g', 'r', 'g', 'n', ' ', ' ', ' ', ' ', '  (1)',' ',' ',' ',' '],
	['M', 'g', 'M', 'g', 'M (1)', 'g', 'n', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	['b', 'b', 'b', 'A', 'r (1)', 'g', 'z', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', 'Z', 'r (1)', 'g', 'z', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', 'X', 'r (1)', 'g', 'n', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', 'v', 'b (1)', 'b', 'N', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', '  (1)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', '  (1)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', '  (1)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', '  (1)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', '  (1)', ' ', ' ', ' ', ' ', ' ', ' ', ' ',' ',' ',' ',' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' (p)', ' ', ' ', ' ', ' ',' ',' ',' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
	[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
];