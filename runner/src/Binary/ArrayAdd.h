#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class ArrayAdd : Instruction
  {
  public:
    const static int TypeName = 2;
    ArrayAdd(char *binary, int offset);
    const int get_end() const;

  private:
    Instruction *left;
    Instruction *right;
    int end;
  };
}