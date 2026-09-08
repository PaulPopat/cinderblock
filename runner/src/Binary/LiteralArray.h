#include "./Instruction.h"

namespace Binary
{
  class LiteralArray : Instruction
  {
  public:
    LiteralArray(char *binary, int offset);

    const int get_end() const;

  private:
    int length;
    Instruction **values;
    int end;
  };
}