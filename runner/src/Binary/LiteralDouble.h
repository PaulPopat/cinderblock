#include "./Instruction.h"

namespace Binary
{
  class LiteralDouble : Instruction
  {
  public:
    LiteralDouble(char *binary, int offset);

    const int get_end() const;

  private:
    double* value;
    int end;
  };
}