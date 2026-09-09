#include "./Instruction.h"
#include "./LiteralString.h"

namespace Binary
{
  class ArrayAdd : Instruction
  {
  public:
    const static char TypeName = 2;
    ArrayAdd(char *binary, int offset);
    ~ArrayAdd();
    const int get_end() const;

  private:
    Instruction *left;
    Instruction *right;
    int end;
  };
}