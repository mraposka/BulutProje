# Compiler
CXX = g++
CXXFLAGS = -std=c++11 -Wall

# Executable names
EXEC_COMPRESSOR = compressor
EXEC_DECOMPRESSOR = decompressor

# Source files
SRC_COMPRESSOR = compressor.cpp
SRC_DECOMPRESSOR = decompressor.cpp

# Targets
all: $(EXEC_COMPRESSOR) $(EXEC_DECOMPRESSOR)

$(EXEC_COMPRESSOR): $(SRC_COMPRESSOR)
	$(CXX) $(CXXFLAGS) -o $@ $^

$(EXEC_DECOMPRESSOR): $(SRC_DECOMPRESSOR)
	$(CXX) $(CXXFLAGS) -o $@ $^

clean:
	rm -f $(EXEC_COMPRESSOR) $(EXEC_DECOMPRESSOR)
