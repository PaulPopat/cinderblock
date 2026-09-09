#include "./Instruction.h"

namespace Binary
{
  class LiteralFloat : Instruction
  {
  public:
    const static char TypeName = 8;
    LiteralFloat(char *binary, int offset);
    ~LiteralFloat();

    const int get_end() const;

  private:
    float *value;
    int end;
  };
}