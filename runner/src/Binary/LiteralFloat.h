#include "./Instruction.h"

namespace Binary
{
  class LiteralFloat : Instruction
  {
  public:
    const static int TypeName = 8;
    LiteralFloat(char *binary, int offset);

    const int get_end() const;

  private:
    float *value;
    int end;
  };
}